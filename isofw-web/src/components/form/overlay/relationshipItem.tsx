import { ExtendedJSONSchema } from "@xpfw/form"
import { get, isNil } from "lodash"
import * as React from "react"
import I18n from "isofw-web/src/components/i18n"
import { FaTrashAlt, FaPlus } from "react-icons/fa"

class WebRelationshipItem extends React.Component<{
    item: any
    schema: ExtendedJSONSchema
    removeId?: any
    addId?: any
    isAdd?: boolean
    noAction?: boolean
}, any> {
  public render() {
    let name = "loading"
    let id
    const obj = this.props.item
    if (!isNil(obj)) {
      name = get(obj, get(this.props, "schema.relationship.namePath", "id"), "NOTFOUND")
      id = get(obj, get(this.props, "schema.relationship.idPath", "id"), "NOTFOUND")
    }
    return (
    <div
      className="card fullWidthCard whiteGradient"
      onClick={this.props.noAction ? undefined :
        this.props.isAdd ? this.props.addId.bind(this, id) : this.props.removeId.bind(this, id)}
    >
      <div className="flexRow alignCenter justifyCenter">
        <div className="flex1">
          <header style={{margin: "0.3rem"}}>
            <span className="is-size-6 has-text-weight-bold">
              {name}
            </span>
          </header>
        </div>
        {this.props.noAction ? undefined : (
          <div className="alignCenter justifyCenter" style={{flexGrow: 0, marginRight: "0.375rem"}}>
            {this.props.isAdd ? (
              <FaPlus className="has-text-success" />
            ) : (
              <FaTrashAlt className="has-text-danger" />
            )}
          </div>
        )}
      </div>
    </div>
    )
  }
}
export default WebRelationshipItem
