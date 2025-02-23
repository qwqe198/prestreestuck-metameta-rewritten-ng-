addLayer("e", {
    symbol: "E",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
		tt: n(0),
    }},
    prestigeButtonText() { 
        return "让时间反转以获得 <b>+" + formatWhole(this.getResetGain()) + `</b> 永恒点 + <b>+` + formatWhole(this.getTTGain()) + `</b>时间定理(总计定理:${formatWhole(player.overflow.total)})`+ ("<br/>下一个定理将于 " + format(this.getNextAt()) + " 时间时获得")
    },
    //待写
    getResetGain() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return player.points.add(10).slog(10).div(this.requires().slog(10)).root(308).pow(pow).floor().mul(mult).floor()
    },
    getTTGain() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return player.points.add(10).slog(10).div(this.requires().slog(10)).root(308).pow(pow).floor().mul(mult).floor()
    },
    getNextAt() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return ten.tetr(this.getResetGain().add(1).div(mult).root(pow).pow(308).mul(this.requires().slog(10))).sub(10)
    },
    effect1(){
      var root = n(2).pow(player.overflow.total.add(1).pow(0.6).sub(1))
      return root
    },
    effect2(){
      var root = n(2).pow(player.overflow.total.add(1).pow(0.4).sub(1))
      return root
    },
    effectDescription() {
        return `点数的指数塔层数变为其 ${format(this.effect1())} 次根<br>元性质变为其 ${format(this.effect2())} 次方`
    },
    color: "red",
    resource: "永恒", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){
      //if(player.mm.total.gte(5)) return n('1.8e308')
      return n('10{2}1.8e308')
    },
    baseResource:"点数",
    baseAmount(){return player.points},
    gainMult() {
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() {
      var exp = n(1)
        return exp
    },
    canReset(){return this.getResetGain().gte(1)},
    row: 3, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    unlocked(){return this.getResetGain().gte(1)},
    clickables: {
        11: {
            canClick(){return true},
            display() {return `手机端qol<br>长按以重置`},
            onHold(){doReset(this.layer)}
        },
        /* 12: {
            canClick(){return true},
            display() {return `重置升级`},
            onClick(){
              if(!confirm('您确定要重置升级么?这会进行一次超限!')) return
              player.overflow.upgrades = []
              player.overflow.points = player.overflow.total
              doReset(this.layer,true)
            }
        }, */
    },
    /*upgrades:{
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>二次加速</alternate>",
            description: `时间速率x10^加速子效果^3.解锁升级12和21.`,
            effect(){
              return n(10).pow(buyableEffect('m',22).pow(3))
            },
            effectDisplay(){
              return `当前效果: x${format(upgradeEffect(this.layer,this.id))}`
            },
            cost: n(1),
            unlocked() { return player[this.layer].points.gte(1) || hasUpgrade(this.layer, this.id) },
        },
    }*/
})