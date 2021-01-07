import ComponentC from './ComponentC'
import { UserConsumer } from "./userContext"

const ComponentB = () => {
    return (
        <div>
            <UserConsumer>
            {
                (userName) => {
                    return <div>Hello {userName} from B</div>
                }
            }
            </UserConsumer>
            <ComponentC/>
        </div>
    )
}

export default ComponentB
