function getEXPfactor(){
    return layers.exp.bars.exp.effect()
}
function getEXPeff(id){
    return layers.exp.bars[id].effect()
}
function getLevel(id){
    return layers.exp.bars[id].level()
}
function giveEXP(id,input = n(0)){
    player.exp[id]=player.exp[id].add(layers.exp.bars[id].gain(false,input))
}
addLayer("exp", {
    name: "exp", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EXP",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        exp:n(0),
        time:n(0),
        meta:n(0),
	}},
    color: "lime",
    resource: "EXP",
    type: "none",
    row: "side",
    layerShown(){return hasAchievement('overflow',21)},
    bars: {
        exp: {
            direction: RIGHT,
            width: 800,
            height: 50,
            progress() { return player.exp[this.id].sub(this.getNextAt(this.level())).div(this.getNextAt().sub(this.getNextAt(this.level()))) },
            display(){return `经验(^) - 经验系数=${format(this.effect(),3)} (在不同地方有不同作用,部分标识在对应名称后) (下一级:${format(this.effect(this.level().add(1)),3)}) 等级:${format(this.level())} <br> 经验: ${format(player.exp[this.id].sub(this.getNextAt(this.level())))} / ${format(this.getNextAt().sub(this.getNextAt(this.level())))} (${format(this.progress().mul(100))}%) &nbsp + ${format(this.gain())}/s${this.base()}`},
            effect(level = this.level()){
                var eff = level.root(1.25).div(15).add(1)
                eff = powsoftcap(eff,n(4),1.125)
                if(hasAchievement('overflow',23)) eff = eff.mul(achievementEffect('overflow',23))
                return eff
            },
            textStyle: {"color": "red"},
			fillStyle: {"background-color": "#F9F900"},
            level(){
                var lv = player.exp[this.id].div(100).add(1).log10().mul(4).floor()
                return lv
            },
            getNextAt(lv = this.level().add(1)){
                var req = ten.pow(lv.div(4)).sub(1).mul(100)
                return req
            },
            gain(){
                var gain = n(3)
                for(i in layers.exp.bars) if(i!="layer") gain = gain.mul(layers.exp.bars[i].level().add(1))
                gain = gain.root(1.75)
                gain = gain.pow(getEXPfactor())
                return gain
            },
            auto(){return n(1)},
            base(){return `(基于各个等级,等级保留)`},
            unlocked(){return hasAchievement('overflow',21)},
        },
        time: {
            direction: RIGHT,
            width: 800,
            height: 50,
            progress() { return player.exp[this.id].sub(this.getNextAt(this.level())).div(this.getNextAt().sub(this.getNextAt(this.level()))) },
            display(){return `时间(^) - 时间速率x${format(this.effect())} (下一级:${format(this.effect(this.level().add(1)))}) 等级:${format(this.level())} <br> 经验: ${format(player.exp[this.id].sub(this.getNextAt(this.level())))} / ${format(this.getNextAt().sub(this.getNextAt(this.level())))} (${format(this.progress().mul(100))}%) &nbsp + ${format(this.gain())}/s${this.base()}`},
            effect(level = this.level()){
                var eff = two.pow(level.pow(1.33))
                return eff
            },
            textStyle: {"color": "red"},
			fillStyle: {"background-color": "lime"},
            level(){
                var lv = player.exp[this.id].div(100).add(1).log10().mul(4).floor()
                return lv
            },
            getNextAt(lv = this.level().add(1)){
                var req = ten.pow(lv.div(4)).sub(1).mul(100)
                return req
            },
            gain(){
                var gain = expPow(player.m.time.add(10).log10(),1.25).pow(1.25).sub(1)
                gain = gain.pow(getEXPfactor())
                return gain.mul(2)
            },
            auto(){return n(1)},
            base(){return `(基于时间)`},
            unlocked(){return hasAchievement('overflow',21)},
        },
        meta: {
            direction: RIGHT,
            width: 800,
            height: 50,
            progress() { return player.exp[this.id].sub(this.getNextAt(this.level())).div(this.getNextAt().sub(this.getNextAt(this.level()))) },
            display(){return `元(^) - 元性质x${format(this.effect())} (下一级:${format(this.effect(this.level().add(1)))}) 等级:${format(this.level())} <br> 经验: ${format(player.exp[this.id].sub(this.getNextAt(this.level())))} / ${format(this.getNextAt().sub(this.getNextAt(this.level())))} (${format(this.progress().mul(100))}%) &nbsp + ${format(this.gain(false))}${this.base()}`},
            effect(level = this.level()){
                var eff = n(1.6).pow(level.pow(1.4))
                return eff
            },
            textStyle: {"color": "red"},
			fillStyle: {"background-color": "lime"},
            level(){
                var lv = player.exp[this.id].div(100).add(1).log10().mul(8).floor()
                return lv
            },
            getNextAt(lv = this.level().add(1)){
                var req = ten.pow(lv.div(8)).sub(1).mul(100)
                return req
            },
            gain(auto = true,gain = getResetGain('m')){
                var gain = expPow(gain.add(1).log10().mul(4).add(10),n(1.8)).sub(10).div(4).root(2)
                gain = gain.pow(getEXPfactor())
                if(auto) gain = gain.mul(hasAchievement('overflow',22)?0.1:0)
                return gain.mul(2)
            },
            auto(){return n(0)},
            base(){return `(基于重置获得的元性质,重置以获取)`},
            unlocked(){return hasAchievement('overflow',21)},
        },
    },
    tabFormat: [
        //"main-display",
        ["blank", "25px"],
        ["bar","exp"],
        ["blank", "50px"],
        ["bar","time"],
        ["bar","meta"],
        //"clickables",
    ],
    update(diff){
        for(i in layers.exp.bars) if(i!="layer") if(layers.exp.bars[i].unlocked()) player.exp[i] = player.exp[i].add(layers.exp.bars[i].gain().mul(diff))
    },
    doReset(layer){
      if(layers[layer].row == 2) layerDataReset(this.layer,['exp'])
      if(layers[layer].row >= 3) layerDataReset(this.layer,[])
    },
})