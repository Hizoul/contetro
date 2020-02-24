import { menuEntriesLoggedIn, menuEntriesLoggedOut } from "isofw-shared/src/globals/menu"
import urls from "isofw-shared/src/globals/url";
import i18n from "isofw-shared/src/util/i18n"
import {  useAuth } from "isofw-shared/src/util/xpfwdata"
import Link from "isofw-web/src/components/link"
import WebPermissionError from "isofw-web/src/components/permError"
import "isofw-web/src/customizedBulma.sass"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { FaArrowLeft } from "react-icons/fa";
import { MdCloudOff } from "react-icons/md"

const PageContainer: React.FunctionComponent<{
  requireLoggedIn?: boolean
  backTo?: string
}> = observer((props) => {
  const authProps = useAuth()
  const content = props.requireLoggedIn && !authProps.loggedIn ? <WebPermissionError /> : props.children
  return (
    <>
      {props.backTo ? (
        <Link to={props.backTo} className="backButton">
          <FaArrowLeft />
        </Link>
      ) : undefined}
      {content}
    </>
  )
})

export default PageContainer
