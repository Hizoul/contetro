import { Hook, HookContext } from "@feathersjs/feathers"
import { get, set } from "lodash"

export interface IPopulateOptions {
  service: string
  idsAt: string
  mapTo: string
}

const populateEntry = async (hook: HookContext, populateOptions: IPopulateOptions, entry: any) => {
  const value = get(entry, populateOptions.idsAt)
  let newValue: any
  if (value != null) {
    if (Array.isArray(value)) {
      newValue = []
      for (const v of value) {
        newValue.push(await hook.app.service(populateOptions.service).get(v, hook.params))
      }
    } else {
      newValue = await hook.app.service(populateOptions.service).get(value, hook.params)
    }
  }
  if (newValue != null) {
    set(entry, populateOptions.mapTo, newValue)
  }
}

const populate = (populateOptions: IPopulateOptions) => {
  const populateHook: Hook = async (hook) => {
    const dataAt = hook.method === "find" ? "result.data" : "result"
    let data = get(hook, dataAt)
    if (!Array.isArray(data)) {
      data = [data]
    }
    for (const d of data) {
      await populateEntry(hook, populateOptions, d)
    }
    set(hook, dataAt, hook.method === "find" ? data : data[0])
    return hook
  }
  return populateHook
}

export default populate
