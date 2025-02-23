addLayer("mm", {
    //name: "I\'m_so_METAMETA", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='resources/MindustryModPng_madeByMinxyzgo.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new ExpantaNum(0),
		    time:n(0),
		    c11: n(-1),
    }},
    prestigeButtonText() { 
        return "超越以获得 <b>+" + formatWhole(this.getResetGain()) + `</b> 元元(总计元元:${formatWhole(player.mm.total)})` + ((this.getResetGain().gte(1000)) ? "" : ("<br/>下一个于 " + format(this.getNextAt()) + " 元性质"))
    },
    getResetGain() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return player.m.points.div(this.requires()).root(20).pow(pow).floor().mul(mult).floor()
    },
    getNextAt() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return this.getResetGain().add(1).div(mult).root(pow).pow(20).mul(this.requires())
    },
    effect1(){
      var maxLevel = player.mm.total
      return maxLevel
    },
    effect2(){
      var root = n(2).pow(player.mm.total.add(1).root(2.8).sub(1))
      //if(player.mm.total.gte(4)) root = root.pow(1.2)
      return root
    },
    effect3(){
      var maxLevel = player.mm.total.mul(3)
      return maxLevel
    },
    effect4(){
      //return n(1)
      if(hasAchievement('overflow',31) && player.mm.total.gte(4)) return n(1.12).mul(n(1.5).pow(player.mm.total.sub(2).root(5).sub(1)))
      if(hasAchievement('overflow',31)) return n(1.12)
      if(hasAchievement('overflow',13)) return n(1.06)
      if(player.mm.total.lt(5)) return n(1)
      var er = n(1.5).pow(player.mm.total.sub(3).root(5).sub(1))
      return er
    },
    effectDescription() {
        return `本轮超限最高数量:${format(player.mm.best)}<br>元化元等级上限+ ${format(this.effect1())}.<br>元性质变为其 ${format(this.effect2())} 次根 <br>时间浓缩等级上限+ ${format(this.effect3())}
          ${this.effect4().eq(1)?'':`<br>元性质的指数变为其 ${format(this.effect4(),3)} 次根(先于开根)`}`
    },
    color: "#31aeb0",
    resource: "元元", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){
      //if(player.mm.total.gte(5)) return n('1.8e308')
      return n(6.8e38)
    },
    baseResource:"元性质",
    baseAmount(){return player.m.points},
    gainMult() {
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() {
      var exp = n(1)
        return exp
    },
    canReset(){return this.getResetGain().gte(1)},
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    unlocked(){return player.m.points.gte(6.8e38)},
    onPrestige(gain){
        player.mm.best = player.mm.best.max(player.mm.total.add(gain))
    },
    clickables: {
        11: {
            canClick(){return true},
            display() {return `手机端qol<br>长按以重置`},
            onHold(){doReset(this.layer)}
        },
        12: {
            canClick(){return true},
            display() {return `重置升级`},
            onClick(){
              if(!confirm('您确定要重置升级么?这会进行一次超越!')) return
              player.mm.upgrades = []
              player.mm.points = player.mm.total
              doReset(this.layer,true)
            }
        },
        13: {
            canClick(){return true},
            display() {return `调整元元`},
            onClick(){
              if(!confirm('您确定要调整元元么?这会进行一次超越,并重置你的升级!这对你的进度可能没有任何作用!')) return
              var toKeep = prompt(`请输入您要保留的元元数.(自动向下取整) 最高元元:${format(player.mm.best)}`)
              if(toKeep == null) return
              toKeep = new OmegaNum(toKeep)
              if(toKeep.isNaN()){
                alert('不能输入一个格式错误的数字!')
                return
              }
              if(toKeep.gt(player.mm.best)){
                alert('不能输入一个大于您最高元元的数字!')
                return
              }
              if(toKeep.lt(0)){
                alert('不能输入一个小于0的数字!')
                return
              }
              player.mm.upgrades = []
              player.mm.points = toKeep.floor()
              player.mm.total = toKeep.floor()
              doReset(this.layer,true)
            }
        },
    },
    upgrades:{
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>二次加速</alternate>",
            description(){return `时间速率x${format(this.effectBase())}^加速子效果^3.时间速率xlg(本轮元元时长+10).解锁升级12和21.`},
            effectBase(){
              var base = ten
              base = base.mul(challengeEffect('dim',11))
              return base
            },
            effect(){
              var base = this.effectBase()
              return base.pow(buyableEffect('m',22).pow(3)).mul(Math.log10(player.mm.time+10))
            },
            effectDisplay(){
              return `x${format(upgradeEffect(this.layer,this.id))}`
            },
            cost: n(1),
            unlocked() { return player[this.layer].points.gte(1) || hasUpgrade(this.layer, this.id) },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>元化拓展</alternate>",
            description: `元性质购买项价格基于元性质被开根的指数降低.解锁升级22.`,
            effect(){
              return layers.mm.effect2().pow(0.375)
            },
            effectDisplay(){
              return `变为其${format(upgradeEffect(this.layer,this.id))}次根`
            },
            cost: n(1),
            unlocked() { return hasUpgrade(this.layer,11) || hasUpgrade(this.layer, this.id) },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>弦拓展</alternate>",
            description: `解锁节点“弦”.解锁升级22.`,
            cost: n(1),
            unlocked() { return hasUpgrade(this.layer,11) || hasUpgrade(this.layer, this.id) },
        },
        22: {
            title: "<p style='transform: scale(-1, -1)'><alternate>+1+1</alternate>",
            description: `所有元性质购买项+1级.你每秒获得100%的元性质.解锁升级13和31.`,
            cost: n(2),
            unlocked() { return hasUpgrade(this.layer,21) || hasUpgrade(this.layer,12) || hasUpgrade(this.layer, this.id) },
        },
        13: {
            title: "<p style='transform: scale(-1, -1)'><alternate>元元化元</alternate>",
            description: `去除第一个元化元的特殊效果,但你基于元元总数获得额外的元化元和加速子.`,
            effect(){
              return player.mm.total.div(3)
            },
            effectDisplay(){
              return `+ ${format(upgradeEffect(this.layer,this.id))} 元化元和加速子`
            },
            cost: n(2),
            unlocked() { return hasUpgrade(this.layer,22) || hasUpgrade(this.layer, this.id) },
        },
        31: {
            title: "<p style='transform: scale(-1, -1)'><alternate>弦曲率</alternate>",
            description: `弦同时加成时间速率.`,
            effect(){
              return layers.dim.effect().pow(2)
            },
            effectDisplay(){
              return `时间速率x ${format(upgradeEffect(this.layer,this.id))}.`
            },
            cost: n(2),
            unlocked() { return hasUpgrade(this.layer,22) || hasUpgrade(this.layer, this.id) },
        },
    },
    challenges:{
      11:{
        name:'元超限',
        challengeDescription:'达到指定元性质.元元挑战只有在完成后才能获得奖励.在更高元元完成可以获得更好的奖励.',
        rewardDescription(){return `当前最高在${format(getCP('mm',11))}元元完成,超限成就13效果(额外上限)^${format(this.rewardEffect())},成就24效果+${format(this.rewardEffect().sub(1))}.`},
        rewardEffect(){
          var eff = getCP('mm',11).add(2).cbrt()
          return eff
        },
        goal(){return layers.mm.requires().pow(player.mm.total.div(33).add(1.03).pow(1.2))},
        canComplete(){return player.m.points.gte(this.goal())},
        unlocked(){return hasAchievement('overflow',24)},
        onExit(){
          if(this.canComplete())player.mm.c11 = player.mm.c11.max(player.mm.total)
        },
        currencyDisplayName:'元性质'
      },
    },
})
