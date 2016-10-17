export function getRandomList(size) {
    return new Array(size).fill(1).map(num=>parseInt(Math.random() * 100));
}
let guid=-1;
export function getRandomDataSource(size) {
    return getRandomList(size).map(num=>({text: num,key:++guid}));
}