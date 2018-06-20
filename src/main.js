import styles from './main.scss'
import { render } from 'react-dom'
import { 
    BrowserRouter, 
    Link,
    Route 
} from 'react-router-dom'
import App from './App/app'

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('main')
)