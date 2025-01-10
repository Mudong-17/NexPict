export const storage = {
  setItem: (key, value) => {
    if (value === null || value === undefined) {
      return
    }
    window.electron.invoke('StoreServices:setItem', {
      key,
      value: JSON.stringify(value),
    })
  },

  getItem: async (key) => {
    const value = await window.electron.invoke('StoreServices:getItem', { key })
    return value ? JSON.parse(value as string) : null
  },

  removeItem: (key) => {
    window.electron.invoke('StoreServices:removeItem', { key })
  },
}