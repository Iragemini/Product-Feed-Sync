const REDIS_SET_KEY = 'feed:stored_ids';

class ProductsStorage {
  constructor(client) {
    this.client = client;
  }

  /**
   * Add product id
   * @param {array} ids
   */
  async addIds(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return;
      }
      await this.client.sAdd(REDIS_SET_KEY, ids);
    } catch (error) {
      throw new Error(`Failed to add ids to Redis: ${error}`);
    }
  }

  /**
   * Get stored ids
   */
  async getIds() {
    try {
      return await this.client.sMembers(REDIS_SET_KEY);
    } catch (error) {
      throw new Error(`Failed to get ids from Redis: ${error}`);
    }
  }

  /**
   * Remove ids
   * @param {array} ids
   */
  async removeIds(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return;
      }
      await this.client.sRem(REDIS_SET_KEY, ids);
    } catch (error) {
      throw new Error(`Failed to delete selected ids from Redis: ${error}`);
    }
  }

  /**
   * Remove all stored ids
   */
  async clearIds() {
    try {
      await this.client.del(REDIS_SET_KEY);
    } catch (error) {
      throw new Error(`Failed to delete all ids from Redis: ${error}`);
    }
  }
}

export default ProductsStorage;
