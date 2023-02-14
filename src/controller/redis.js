let { client, getRedisClient } = require('../config/redis');

const redisHelper = {
  async get(key) {
    try {
      if (!client) client = getRedisClient();
      const data = await client.get(key);
      if(!data || isNaN(data)){
          return {}
      }
      return JSON.parse(data);
    } catch (error) {
      console.log('get error', error);
    }
  },
  async set(key, value) {
    try {
      if (!client) client = getRedisClient();
      await client.set(key, value);
    } catch (error) {
      console.log('set error', error);
    }
  },
  async getHash(key, hash) {
    try {
      if (!client) client = getRedisClient();
      const tokenData = await client.hget(key, hash);
      if (tokenData) return JSON.parse(tokenData);
      else return null;
    } catch (error) {
      console.log('load token from ', hash, 'error', error);
      return null;
    }
  },
  async getAllHash(key) {
    try {
      const allTokenTS = await client.hgetall(key);
      const keys = Object.keys(allTokenTS);
      console.log('keys', keys);
      // const tokenList = [];
      // for (let i = 0; i < keys.length; i++) {
      //   // tokenList.push(JSON.parse(allTokenTS[keys[i]]));
      //   tokenList.push(JSON.parse(allTokenTS[keys[i]]));
      // }
      return keys;
    } catch (error) {
      console.log('error happen at loadAllTokens ', error);
    }
  },
  async loadAllTokens(key) {
    try {
      const allTokenTS = await client.hgetall(key);
      const keys = Object.keys(allTokenTS);
      const tokenList = [];
      for (let i = 0; i < keys.length; i++) {
        tokenList.push(JSON.parse(allTokenTS[keys[i]]));
      }
      return tokenList;
    } catch (error) {
      console.log('error happen at loadAllTokens ', error);
    }
  },

  async setHash(key, tokenAddress, data) {
    try {
      if (!client) client = getRedisClient();
      if (client) {
        const res = await client.hset(key, tokenAddress, JSON.stringify(data));
        return res;
      } else {
        return null;
      }
    } catch (error) {
      console.log('cant save token,', error);
      return null;
    }
  },
  async deleteHash(key, hash) {
    try {
      await client.hdel(key, hash);
    } catch (error) {
      console.log('error happen at removeHashData', error);
      return error;
    }
  },

  async saveAllTokens(key, data) {
    try {
      client.del(key);
      console.log('done delete redis db with key ', key);
      for (let i = 0; i < data.length; i++) {
        // console.log('data[i] :', data[i]);
        await client.hset(
          key,
          data[i].token.address.toLowerCase(),
          JSON.stringify(data[i])
        );
      }
      console.log('done hset redis db with key ', key);
    } catch (error) {
      console.log('error happen at saveAllTokens', error);
    }
  },

  async loadHBRegisterTokenList(key) {
    try {
      const tokens = client.lrange(key, 0, -1);
      return tokens;
    } catch (error) {
      console.log('error at loadHBRegisterTokenList ', error);
      return null;
    }
  },
  async setHashData(key, hash, value) {
    try {
      await client.hset(key, hash, value);
    } catch (error) {
      console.log('error happen at setData', error);
      return error;
    }
  },
  async getHashData(key, hash) {
    try {
      const data = await client.hget(key, hash);
      return data;
    } catch (error) {
      console.log('error happen at getData', error);
      return null;
    }
  },
  async removeHashData(key, hash) {
    try {
      await client.hdel(key, hash);
      return null;
    } catch (error) {
      console.log('error happen at removeHashData', error);
      return error;
    }
  },
  async getLengthHashKey(key) {
    try {
      const len = await client.hlen(key);
      console.log('sockets:', len, key);
      return len;
    } catch (error) {
      console.log('error happen at getLengthHashKey ', error);
      return null;
    }
  },
  async getAllConnectedSocket(key) {
    try {
      const sockets = await client.hgetall(key);
      console.log('sockets:', sockets, key);
      return sockets;
    } catch (error) {
      console.log('error happen at getAllConnectedSocket ', error);
      return null;
    }
  }
};

module.exports = redisHelper;
