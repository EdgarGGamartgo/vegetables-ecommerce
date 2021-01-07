import { UserConsumer, UserProvider } from "./userContext"
import { useState } from 'react'

const ComponentC = () => {
    const [myTest, setMyTest] = useState('')
    return (
        <>
        <UserConsumer>
            {
                (userName) => {
                    return <div>Hello {userName} from C</div>
                }
            }
        </UserConsumer>
        <UserProvider value={myTest}>
        </UserProvider>
        <input type="text" value={myTest} onChange={(e) => setMyTest(e.target.value)} />
        </>
    )
}

export default ComponentC
