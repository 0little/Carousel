//兼容代码,前几个是兼容该方法的不同浏览器，最后一个是兼容不支持该方法的浏览器,用setTimeout来模拟
window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.setTimeout(function (callback) {
        var start, finish;
        start = +new Date(); //执行回调函数前的时间
        callback(start);
        finish = +new Date(); //执行回掉函数后的时间
        self.timeout = 1000 / 60 - (finish - start);
        //下次调用的时间间隔就会减去本次回调函数的执行时间，
        // 因为浏览器流畅的动画是一秒60帧，所以1000/60的基础上进行计算
        //self即window.self
    }, self.timeout);

window.cancelAnimationFrame = window.cancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.clearTimeout;

var start = null; //开始时间
var timeid = null; //定时器的Id
var width = 683; //图片的宽度
var element = document.querySelector('.inner');
element.style.position = 'absolute';
var cur = 0; //当前图片编号
var flag = 0; //用于标记鼠标有没有在元素内部，初始为0,表示没有

//该函数是设置轮播图轮播一个图所经历的变化过程
//timestamp: 动画从开始到现在所经历的时间
function step(timestamp) {
    //处理调用该函数前有延迟的情况
    if(!start) start = timestamp;
    console.log(start);
    var progress = timestamp - start; //计算一个图片从开始动到当前位置所经历的时间
    if(cur < 4) {
        element.style.left = -Math.min((progress/1000+cur) * width, (cur+1) * width) + 'px';
    } else {
        cur = 0;
        element.style.left = 0;
    }


    if(progress < 1000) {
        //说明当前图片的移动还没有完成，一次移动需要1s
        timeid = window.requestAnimationFrame(step);
    } else {
        cur=cur<4?cur+1:0
        window.cancelAnimationFrame(timeid)
        timeid=null
        start=null
        setTimeout(auto,3000)
    }
}

function auto() {
    if(flag) return;
    if(!timeid) {
        window.requestAnimationFrame(step);
    }
}

// document.getElementsByTagName('body')[0].onmousemove = function (e) {
//     if(e.clientX >= 0 && e.clientX <= 683 && e.clientY >= 0 && e.clientY <= 384) {
//         flag = 1;
//     } else {
//         flag = 0;
//         auto();
//     }
// };

setTimeout(auto, 3000);