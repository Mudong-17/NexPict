import { ipcMethod } from '../decorators/ipcMethod'
import { storage } from '../utils'

export class StoreServices {
  @ipcMethod
  getItem({ key }) {
    if (storage.has(key)) {
      return storage.get(key)
    }
    return null
  }

  @ipcMethod
  async setItem({ key, value }) {
    storage.set(key, value)
  }

  @ipcMethod
  async removeItem({ key }) {
    storage.delete(key)
  }
}
