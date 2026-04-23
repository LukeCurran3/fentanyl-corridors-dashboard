import en from './en'
import es from './es'

const lang = import.meta.env.VITE_LANG === 'es' ? es : en

export default lang
