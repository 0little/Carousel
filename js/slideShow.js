window.onload =function () {
    var prev = document.getElementsByClassName("prev")[0];
    var next = document.getElementsByClassName("next")[0];
    var count = 1; //count记录当前是哪张图片
    var ul = document.getElementsByTagName("ul")[0];
    var lis = document.getElementsByTagName("li");
    var items = document.getElementsByClassName("item");
    var containerBox = document.getElementsByClassName("container")[0];
    var changeImgTime = 1000; //切换图片所需时间为1000ms
    var carouselInterval = 3000; //轮播图的时间间隔为3000ms
    var stepTimer = null; //该变量用于表示一次切换所需的计时器

//我们把容器的大小在js中设置，保证代码良好的复用性
    var containerWidth = 800;
    containerBox.style.width = containerWidth + "px";

    var liLen = lis.length;
    ul.style.width = (liLen * containerWidth) + "px";
    ul.style.left = (-1 * containerWidth) + "px";

    for (var i = 0; i < liLen; i++) {
        lis[i].style.width = containerWidth + "px";
    }

//因为在收尾各加了一张假图，故li个数比图片个数多2
    var imgCount = liLen - 2;

//自动轮播
    var timer = null;
    timer = setInterval(autoPlay, carouselInterval); //一开始就会自动轮播
//自动轮播时整个页面往左移动
    function autoPlay() {
        count++;
        lightDot();
        slide("left");
    }

//鼠标移动到container里时，停止自动轮播
    containerBox.onmouseover = function () {
        clearInterval(timer);
    };

//鼠标移出container时，继续自动轮播
    containerBox.onmouseout = function () {
        timer = setInterval(autoPlay, carouselInterval);
    };

//更换底部小圆点的高亮状态
    function lightDot() {
        for (i = 0; i < items.length; i++) {
            if (i == (count - 1) % liLen) {
                items[i].className = "item active";
            } else {
                items[i].className = "item";
            }
        }
    }

    function slide(direction) {
        if (direction == "left") {
            //让整个页面向左运动一个图片宽度，故应使left值减800
            /*要产生向左滑动的效果，需将一张图片的滑动切割成若干步，这里我们取100步，完成这一百步需要
             的总时间为changeImgTime*/
            //记录下原始的left值
            clearInterval(timer);
            var left = parseInt(ul.style.left);
            var tmpLeft = left;
            stepTimer = setInterval(function () {
                if (tmpLeft <= left - containerWidth) {
                    clearInterval(stepTimer);
                    stepTimer = null;
                    return;
                }
                tmpLeft -= containerWidth / 100;
                ul.style.left = tmpLeft + "px";
                console.log(1);
            }, changeImgTime / 100);
            /*若原本是图片6，整个页面往左移动后count变为7，显示的是图片1（因为在html中在图片6后面
             还放了一个图片1），再往后就没有图片了，所以应该把整个页面重新拉回上一个图片1，这个变化
             不应该被用户察觉，故应把时间设置得尽可能短*/
            if (count == imgCount + 2) {
                count = 1;
                lightDot();
                clearInterval(timer);
                timer0 = setInterval(function () {
                    left = parseInt(ul.style.left);
                    if (left == -1 * containerWidth) {
                        clearInterval(timer0);
                    }
                    ul.style.left = -containerWidth + "px";
                }, 0.5);
                //location.reload();
            }
            timer = setInterval(autoPlay, carouselInterval);
        } else if (direction == "right") {
            //让整个页面向右运动一个图片宽度，故应使left值加800
            var left = ul.style.left;
            stepTimer = setInterval(function () {
                var tmpLeft = left;
                if (tmpLeft >= left + 800) {
                    clearInterval(stepTimer);
                    stepTimer = null;
                    return;
                }
                tmpLeft += containerWidth;
                ul.style.left = tmpLeft + "px";
            }, changeImgTime / 100);

            if (count == 0) {
                count = imgCount;
                lightDot();
                ul.style.left = (-1 * containerWidth * imgCount) + "px";
            }
        }
    }


//给向前的按钮增加点击事件
    prev.click(function () {
        if (stepTimer) {
            count++; //假设原本是图片1，按向前的按钮，就会变为图片2，故count值应该加一
            //更换底部小圆点的高亮状态
            lightDot();
            //图片移动
            slide("left");
        }
    });

//给向后的按钮增加点击事件，道理跟向前的按钮一样
    next.click(function () {
        if (stepTimer) {
            count--;
            //更换底部小圆点的高亮状态
            lightDot();
            //图片移动
            slide("right");
        }
    });

//给小圆点增加点击事件
    for (var i = 0; i < items.length; i++) {
        items[i].onclick = function () {
            var index = i;
            count = index + 1;
            lightDot();
            ul.style.left = -1 * count * containerWidth + "px";
        }
    }

}
