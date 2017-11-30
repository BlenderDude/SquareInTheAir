let touches = []
const TouchManager = {
    touch: (_touches)=>{
        touches = _touches
    },
    getTouches: ()=>touches,
}
export default TouchManager