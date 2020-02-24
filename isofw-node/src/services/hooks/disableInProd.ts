import { Hook } from "@feathersjs/feathers"
import val from "isofw-shared/src/globals/val";

const disableInProd: Hook = async (hook) => {
    if (!val.isDebug) {
        throw new Error("disabled in production")
    }
    return hook
}

export default disableInProd