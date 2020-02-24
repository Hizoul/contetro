import urls from "isofw-shared/src/globals/url"
import WebButton from "isofw-web/src/components/button"
import WithFieldBackground from "isofw-web/src/components/gameSession/background/withFieldBackground"
import LocalCreateComponent from 'isofw-web/src/components/local/create'
import "isofw-web/src/customizedBulma.sass"
import * as React from "react"
import { FaArrowLeft } from "react-icons/fa"

const CreateLocalMatch: React.FunctionComponent<any> = () => {
  return (
    <WithFieldBackground
      contentComponent={(props) => {
        return (
          <>
            <LocalCreateComponent {...props} />
            {/* <WebButton
              style={props.buttonStyle}
              text="back"
              to={urls.home}
              icon={<FaArrowLeft />}
              leftIcon={true}
              isOverlay={true}
              className="whiteGradient"
            /> */}
          </>
        )
      }}
    />
  )
}

export default CreateLocalMatch
