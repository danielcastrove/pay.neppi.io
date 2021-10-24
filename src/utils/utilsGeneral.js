

export function numberFloatFormater( number ){
    return Math.round((parseFloat(number) + Number.EPSILON) * 100) / 100
}