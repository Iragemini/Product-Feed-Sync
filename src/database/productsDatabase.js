import PostgresClient from './client.js';
import DatabaseError from '../errors/DatabaseError.js';

class ProductsDatabase extends PostgresClient {
  constructor(config) {
    super(config);
  }

  /**
   * Add or update product to the database
   *
   * @param {object} data
   */
  async addProduct(data) {
    const { id, title, link, image_link, price, currency, availability } = data;

    try {

      await this.query('SELECT feed.create_or_update_product($1, $2, $3, $4, $5, $6, $7)',
        [id, title, link, image_link, price, currency, availability],
      );
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Failed to add the product to the database.');
    }
  }

  /**
   * Delete a batch of products by their ids
   *
   * @param {array} ids
   * @returns {Promise<number>} the number of deleted records
   */
  async deleteProducts(ids) {
    try {
      const res = await this.query('SELECT feed.remove_products_by_ids($1)', ids);

      return res.rows[0].remove_products_by_ids;
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Failed to delete product/products from the database.');
    }
  }

  /**
   * Search a product by title
   *
   * @param {string} title
   * @returns {Promise<array>}
   */
  async findByTitle(title) {
    try {

      const res = await this.query('SELECT * FROM feed.search_products_by_title($1)', [title]);

      return res.rows;
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Failed to search the product in the database.');
    }
  }
}

export default ProductsDatabase;
