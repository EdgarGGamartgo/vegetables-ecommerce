
import ComponentA from '../components/ComponentA'
import { UserProvider, UserConsumer } from '../components/userContext'

const MyContext = () => {
    return (
        <div>
            <UserProvider value="Edgar">
                <ComponentA/>
                <UserConsumer>
            {
                (userName) => {
                    return <div>Hello {userName} from MyContext</div>
                }
            }
        </UserConsumer>
            </UserProvider>         
        </div>
    )
}

export default MyContext


/*
    DIFINE A CONTEXT

    1. Create the context
    2. Provide a context value
    4. COnsume the context value
*/