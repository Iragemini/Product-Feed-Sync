import axios from 'axios';
import PartialXMLStreamParser from 'partial-xml-stream-parser';
import ApiError from '../errors/ApiError.js';

class ProductsService {
  constructor({ storage, dbClient }, config) {
    this.storage = storage;
    this.dbClient = dbClient;
    this.config = config;
    this.parser = new PartialXMLStreamParser();
  }

  /**
   * Fetch feed add products to the database
   * @returns {Promise}
   */
  async fetchFeed() {
    const { config: {
      feedUrl,
    } } = this;
    const fetchedIds = new Set();
    let processingPromise = Promise.resolve();

    const response = await axios.get(feedUrl, { responseType: 'stream' });

    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        processingPromise = processingPromise.then(async () => {
          const result = this.parser.parseStream(chunk.toString());

          if (result?.xml?.length > 0) {
            const items = result.xml[0]?.rss?.channel?.item;
            const list = Array.isArray(items) ? items : [items];

            for (const item of list) {
              const id = item['ns0:id']?.['#text'];
              if (id) {
                fetchedIds.add(id);

                const [price, currency] = item['ns0:price']?.['#text'].split(' ');
                const availability = item['ns0:availability']?.['#text'] || 'unknown';

                const data = {
                  id,
                  title: item['title']?.['#text'],
                  description: item['description']?.['#text'],
                  link: item['link']?.['#text'],
                  image_link: item['ns0:image_link']?.['#text'],
                  price: parseFloat(price),
                  currency,
                  availability,
                };

                try {
                  await this.dbClient.addProduct(data);
                } catch (err) {
                  throw new ApiError(`Failed to add product ${id}: ${err.message}`)
                }
              }
            }
          }
        });
      });

      response.data.on('end', async () => {
        try {
          await processingPromise;
          this.parser.parseStream(null);

          const storedIds = await this.storage.getIds();
          const fetchedIdsArray = Array.from(fetchedIds);
          const idsToDelete = storedIds.filter(id => !fetchedIds.has(id));

          if (idsToDelete.length > 0) {
            await this.dbClient.deleteProducts(idsToDelete);
            await this.storage.removeIds(idsToDelete);
          }

          await this.storage.addIds(fetchedIdsArray);
          resolve();
        } catch (err) {
          console.error('Error in end handler:', err);
          reject(new ApiError(`An error occurred during sync: ${err.message}`));
        }
      });

      response.data.on('error', (err) => {
        console.error('Stream error:', err);
        reject(err);
      });
    });
  }

  /**
   * Search products by title
   *
   * @param {string} title
   * @returns 
   */
  async findByTitle(title) {
    try {
      const res = await this.dbClient.findByTitle(title);

      return res;
    } catch (error) {
      throw new ApiError(`Failed to search by title ${title}`);
    }
  }
}

export default ProductsService;
