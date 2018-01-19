/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
var PI = Math.PI, sin = Math.sin, cos = Math.cos, random = Math.random;

function DrawInter(container,option) {
    var that = this;
    this.opt = {
        moveSpeed:5,
        color:'255,255,255',
        partCount:100,
        percent:0
    };
    option&&(Object.keys(option).forEach(function (t) {
        if(that.opt.hasOwnProperty(t)){
            that.opt[t] = option[t];
        }
        if(t==='color'){
            var arr = option.color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)\)$/);
            that.opt.color= arr[1]+','+arr[2]+','+arr[3];
        }
    }));
    this.count = 0;
    this.keepAnimate = false;
    this.colorStr = this.opt.color;
    this.moveSpeed = this.opt.moveSpeed;
    this.particlesLength=this.opt.partCount;
    this.percent = this.opt.percent;

    this._width=container.offsetWidth;
    this._height=container.offsetHeight;
    this.particles =[];
    this._init();
    this._initPart();
    this._calPoint();
    this._drawShape(this.shape);
    this._initFill();

    this.myTween(0,this.percent,500,function (t) {
          that.drawFill(t);
      });


 //   that.drawFill(0.99);
    this.percent&&this.drawParticle();
    container.append(this.canvas);
    container.append(this.partCanvas);
}
DrawInter.prototype={
    _init:function () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.ctx = this.canvas.getContext('2d');
        this.lr = (this._width-10)/2;
        this.sr = Math.round((this._width-10)/4);
        this._fillHeight = this._height - 4*this.sr - 5;
        this.moveHeight = this._height - 5*this.sr;
        this._bubHeight = this.percent>0.45?(this._fillHeight*0.45):(this._fillHeight*this.percent);
        console.log(this._bubHeight)
    },
    _calPoint:function () {
        var that = this;
        this.shape = {
            zero:[0,0],
            lt:[-1*that.lr,-1*that._height+that.sr*4],
            lb:[-1*that.lr,0],
            rt:[that.lr,-1*that._height+that.sr*4],
            rb:[that.lr,0],
        }
    },
    _drawShape:function (point) {
        this.shapeCanvas = document.createElement('canvas');
        this.shapeCanvas.width = this._width;
        this.shapeCanvas.height = this._height;
        var ctx = this.shapeCanvas.getContext('2d');
        ctx.save();
        var linerColor = ctx.createLinearGradient(0,0,this._width,0);
        linerColor.addColorStop(0,'rgba('+this.colorStr+',.75)');
        linerColor.addColorStop(0.25,'rgba('+this.colorStr+',0)');
        linerColor.addColorStop(0.75,'rgba('+this.colorStr+',0)');
        linerColor.addColorStop(1,'rgba('+this.colorStr+',.8)');
        ctx.fillStyle = linerColor;
        ctx.fillRect(5,2*this.sr+5,this._width-10,this._height-4*this.sr);
        ctx.restore();
        ctx.translate(this.lr+5,this._height-this.sr-10);
        ctx.save();
        ctx.strokeStyle = 'rgb('+this.colorStr+')';
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba('+this.colorStr+',1)';
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(point.rb[0],point.rb[1]);
        ctx.shadowOffsetY = -4;
        ctx.bezierCurveTo(point.rb[0],point.rb[1]+this.sr,point.lb[0],point.lb[1]+this.sr,point.lb[0],point.lb[1]);
        ctx.lineTo(point.lt[0],point.lt[1]);
        ctx.bezierCurveTo(point.lt[0],point.lt[1]+this.sr,point.rt[0],point.rt[1]+this.sr,point.rt[0],point.rt[1]);
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.shadowOffsetY = 4;
        ctx.moveTo(point.lt[0],point.lt[1]);
        ctx.bezierCurveTo(point.lt[0],point.lt[1]-this.sr,point.rt[0],point.rt[1]-this.sr,point.rt[0],point.rt[1]);
        ctx.lineTo(point.rb[0],point.rb[1]);
        ctx.stroke();
        ctx.restore();
    },
    _drawBg:function () {
        this.ctx.clearRect(0,0,this._width,this._height);
        this.ctx.drawImage(this.shapeCanvas,0,0);
    },
    _initFill:function () {
        this.fillCanvas = document.createElement('canvas');
        this.fillCanvas.width = this.lr*2-5;
        this.fillCanvas.height = this._height-2*this.sr;
        this.fillCtx = this.fillCanvas.getContext('2d');
        this.fillCtx.translate(this.lr,this._height-2*this.sr-10);
    },
    calFill:function (percent) {
        var that = this;
        this.fillPoint = {
            zero:[0,0],
            lt:[-1*that.lr+5,-1*this._fillHeight*percent-5],
            lb:[-1*that.lr+5,-5],
            rt:[that.lr-5,-1*this._fillHeight*percent-5],
            rb:[that.lr-5,-5]
        };
    },
    drawFill:function (percent) {
        this.calFill(percent);
        var ctx = this.fillCtx,point=this.fillPoint;
        this._drawBg();
        ctx.strokeStyle = 'red';
        ctx.clearRect(this.shape.lt[0],this.shape.lt[1]-this.sr,2*this.lr,this._height-2*this.sr);

        var linerColor = ctx.createLinearGradient(point.lt[0],0,point.rt[0],0);
        linerColor.addColorStop(0,'rgba('+this.colorStr+',.8)');
        linerColor.addColorStop(0.4,'rgba('+this.colorStr+',1)');
        linerColor.addColorStop(0.7,'rgba(62,41,4,.6)');
        linerColor.addColorStop(1,'rgba('+this.colorStr+',1)');

        ctx.save();
        ctx.strokeStyle = 'rgb('+this.colorStr+')';
        ctx.fillStyle =linerColor;
        ctx.save()

        ctx.beginPath();
        ctx.moveTo(point.rb[0],point.rb[1]);
        ctx.bezierCurveTo(point.rb[0],point.rb[1]+this.sr,point.lb[0],point.lb[1]+this.sr,point.lb[0],point.lb[1]);
        ctx.lineTo(point.lt[0],point.lt[1]);
        ctx.bezierCurveTo(point.lt[0],point.lt[1]-this.sr,point.rt[0],point.rt[1]-this.sr,point.rt[0],point.rt[1]);
        ctx.moveTo(point.lt[0],point.lt[1]);
        ctx.bezierCurveTo(point.lt[0],point.lt[1]+this.sr,point.rt[0],point.rt[1]+this.sr,point.rt[0],point.rt[1]);
        ctx.lineTo(point.rb[0],point.rb[1]);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle ='rgba('+this.colorStr+',.85)';
        ctx.moveTo(point.lt[0],point.lt[1]);
        ctx.bezierCurveTo(point.lt[0],point.lt[1]+this.sr,point.rt[0],point.rt[1]+this.sr,point.rt[0],point.rt[1]);
        ctx.bezierCurveTo(point.rt[0],point.rt[1]-this.sr,point.lt[0],point.lt[1]-this.sr,point.lt[0],point.lt[1]);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        this.ctx.drawImage(this.fillCanvas,5,this.sr);

    },
    updateFill:function (percent) {
        var old = this.percent,that=this;
        this.percent = percent;
        this.myTween(old,this.percent,500,function (t) {
            that.drawFill(t);
        });
        this.keepAnimate = false;
        this.partCtx.clearRect(5-this.lr,4*this.sr-this._height,2*this.lr,this._height-2*this.sr);
        this.percent&&this.drawParticle();
    },
    calPram:function () {
        var _height=this._height,width=this.lr-5;
        var y = _height*1-_height*random()+random()*this._bubHeight;  //(0.5+random())*height/2
        var x = (1 - 2*random())*width;
        var k = 1.5- y/_height;
        return {
            position:{
                x:x,
                y:-y/2
            },
            r:2*k,
            alpha:k
        };
    },
    _initPart:function () {
        this.partCanvas = document.createElement('canvas');
        this.partCanvas.width = this._width -10;
        this.partCanvas.height = this._height ;
        this.partCanvas.style.cssText = "position:absolute;top:0px;left:0;";
        this.partCtx =  this.partCanvas.getContext('2d');
        this.partCtx.translate(this.lr+5,this._height-this.sr-10);
        this.initParticle();
    },
    initParticle:function () {
        for(var i = 0; i<this.particlesLength ;i++){
            this.particles.push(new Particle(this.calPram(),this.colorStr));
        }
    },
    drawParticle:function () {
        var that=this;
        this.particles.forEach(function (t) {
            that.partCtx.drawImage(t.canvas,t.position.x,t.position.y);
        });
        this.keepAnimate = true;
        this._moveParticle();
    },
    _moveParticle:function () {
        var that = this,height= this._height-4*this.sr;
        this.count++;
        this.keepAnimate&&requestAnimationFrame(this._moveParticle.bind(this));
        if(this.count<this.moveSpeed){
            return ;
        }
        this.partCtx.clearRect(5-this.lr,4*this.sr-this._height,2*this.lr,this._height-2*this.sr);
        this.particles.forEach(function (t) {
            t.position.x = t.position.x*0.95;
            t.position.y = t.position.y - that.sr*0.3;
            t.alpha = 1.2+t.position.y/height;
            t.size = t.size*0.999;
            if(t.position.y <-that.moveHeight || t <0.1){
                var option = that.calPram();
                t.alpha = option.alpha;
                t.size = option.r;
                t.position=option.position
            }
            t.draw();
            that.partCtx.drawImage(t.canvas,t.position.x,t.position.y);
        });
        this.count = 0;
    },
/*    updateParticle:function () {  //动画统一控制,没啥显著的性能提升
        var that = this,height= this._height-4*this.sr;
        this.partCtx.clearRect(5-this.lr,4*this.sr-this._height,2*this.lr,this._height-2*this.sr);
        this.keepAnimate&&this.particles.forEach(function (t) {
            t.position.x = t.position.x*0.95;
            t.position.y = t.position.y - that.sr*0.3;
            t.alpha = 1.2+t.position.y/height;
            t.size = t.size*0.999;
            if(t.position.y <-that.moveHeight || t <0.1){
                var option = that.calPram();
                t.alpha = option.alpha;
                t.size = option.r;
                t.position=option.position
            }
            t.draw();
            that.partCtx.drawImage(t.canvas,t.position.x,t.position.y);
        });
    },*/
    myTween:function(start,end,length,tweenFun) {
        var arr = [],count=0,arrLength = 50*length/1000,step = (end-start)/arrLength;
        for (var i=0;i<=arrLength;i++){
            arr.push(start+step*i);
        }
        animate();
        function animate() {
            if(count>arrLength){
                return ;
            }
            tweenFun(arr[count]);
            count++;
            requestAnimationFrame(animate);
        }
    }
};
/**
 * 生成星星
 * size:星星大小
 * position:星星在页面中的位置
 *         this.starOption={
            minSize:option.starMinSize,
            maxSize:option.starMaxSize-option.starMinSize,
            minLux:option.starMinLux,
            maxLux:option.starMaxLux-option.starMinLux
        };
 * */
function Particle(option,color) {
    this._position = option.position;
    this.colorStr = color;
    this._size = option.r;
    this.position = {
        x:option.position.x,
        y:option.position.y
    };
    this.size =option.r;  //设置星星半径大小，最小半径，最大半径，这里为3~6;
    this.domSize = Math.ceil(this.size * 3);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.domSize;
    this.canvas.height = this.domSize;
    this.alpha = option.alpha; //保证值在0.35 到 1 之间
    this._alpha =  option.alpha;
    this.ctx = this.canvas.getContext('2d');
    this.draw();
}

Particle.prototype = {
    draw: function () {
        this.color = 'rgba('+this.colorStr+',' + this.alpha + ')';
        this.ctx.shadowBlur = this.size * 0.8;
        this.ctx.shadowColor = this.color;
        this.ctx.clearRect(0,0,this.domSize,this.domSize);
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.domSize / 2, this.domSize / 2, this.size * 0.5, 0, 2 * PI);
        this.ctx.closePath();
        this.ctx.fill();
    },
    update: function () {
        var that = this;
        this.ctx.clearRect(0, 0, this.domSize, this.domSize);
        if(this.position.y <-320 || this.alpha<0.1 ||this.size<0.1){
            this.alpha = this._alpha;
            this.size = this._size;
            this.position={
                x:that._position.x,
                y:that._position.y
            }
        }
        this.draw();
    }
};