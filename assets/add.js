window.onload = function(){
				var imgList = document.getElementById("imgList");
				var navContainer = document.getElementById("navContainer");
				var outer = document.getElementById("outer");
				var picLbtn = document.getElementById("picLbtn");
				var picRbtn = document.getElementById("picRbtn");
				var imgArr = document.querySelectorAll("#imgList>li>img");
				/*设置按钮居中*/
				navContainer.style.left = (outer.offsetWidth - navContainer.offsetWidth)/2 + "px";
				var tempBtnTop = (outer.offsetHeight - picLbtn.offsetHeight)/2 + "px";
				picLbtn.style.top = tempBtnTop;
				picRbtn.style.top = tempBtnTop;
				//-- 获取元素样式，最低兼容ie8
				function getStyle(obj, name) {
					if(window.getComputedStyle) {
						return getComputedStyle(obj, null)[name];
					} else {
						return obj.currentStyle[name];
					}
				}
				//-- 获取outer的宽度
				var getOuterWidth = getStyle(outer,"width");
				var widthObject = getOuterWidth.match(/\d*/);
				var width = widthObject[0];
				//-- 根据图片的数量设置ul的总宽度
				imgList.style.width = width*imgArr.length+"px";
				function move(obj, attr, target, speed, callback){
					clearInterval(obj.timer);
					var current = parseInt(getStyle(obj, attr));
					if(current > target) {
						speed = -speed;
					}
					obj.timer = setInterval(function(){
						var oldValue = parseInt(getStyle(obj, attr));
						var newValue = oldValue + speed;
						if((speed < 0 && newValue < target) || (speed > 0 && newValue > target)) {
							newValue = target;
						}
						obj.style[attr] = newValue + "px";
						if(newValue == target) {
							clearInterval(obj.timer);
							callback && callback();
						}
					}, 30);
				}
				//设置默认选中的效果
				var index = 0;
				var allA = document.querySelectorAll("#navContainer>a");
				allA[index].style.backgroundColor = "black";
				//-- 正常开启自动切换函数
				autoChange();
				function setA(){
					if(index >= imgArr.length - 1){
						index = 0;
						imgList.style.left = 0;
					}
				}
				function setRed(){
					for(var i=0 ; i<allA.length ; i++){
						allA[i].style.backgroundColor = "";
					}
					allA[index].style.backgroundColor = "black";
				}
				var timer;
				//--自动切换图片
				function autoChange(){
					timer = setInterval(function(){
						index++;
						index %= imgArr.length;
						move(imgList , "left" , -width*index , 20 , function(){
							setA();
							setRed();
						});
					},3000);
				}
				//--实现点击导航点切换图片
				//--调用setA、move、autochange函数
				for(var i=0; i<allA.length ; i++){
					allA[i].num = i;
					allA[i].onclick = function(){
						clearInterval(timer);
						index = this.num;
						setRed();
						move(imgList , "left" , -width*index , 20 , function(){
							autoChange();
						});
					}
				picLbtn.onclick = function(){
					clearInterval(timer);
					if (index != 0){
						index = index-1;
					}
					setRed();
					move(imgList , "left" , -width*index , 20 , function(){
						autoChange();
					});
				}
				picRbtn.onclick = function(){
					clearInterval(timer);
						if (index != allA.length - 1) {
							index = index+1;
						}
						setRed();
						move(imgList , "left" , -width*index , 20 , function(){
							autoChange();
						});
					}
				}
				var startX = 0;
				var moveX = 0;
				var distanceX = 0;
				var isMove = false;
				outer.addEventListener('touchstart', function(e){
        			clearInterval(timer); //--清除定时器,要记得事件结束之后再打开
        			startX = e.touches[0].clientX;  //--触摸点的横坐标
   				});
				outer.addEventListener('touchmove',function(e){
	        		moveX = e.touches[0].clientX;//--获取当前手的横坐标
	        		distanceX = moveX - startX; //--移动的距离=现在-初始
	        		isMove = true;//证明滑动过
					move(imgList , "left" , -width*index+distanceX , 20 , function(){});
	    		});
				outer.addEventListener('touchend', function(){
	        		if(isMove && Math.abs(distanceX) > width/3){
	            		if(distanceX > 0 && index != 0){
	                		index = index - 1;
	        			}
	        			else if(distanceX < 0 && index != imgArr.length - 2){
	            			index = index + 1;
	        			}
	        			move(imgList , "left" , -width*index, 20 , function(){});
	        		}
	        		else if(isMove && Math.abs(distanceX) < width/3){
	        			move(imgList , "left" , -width*index, 20 , function(){});
	        		}
	        		setRed();
	        		autoChange();
	    		});
			}