import styles from './main.scss'
import ReactDOM from 'react-dom'

ReactDOM.render(
    <div>
        <h1 className={styles.h1}>333333</h1>
        <img src={require('./browserify.png')} />
    </div>,
    document.getElementById('main')
)