addLayer("dim", {
    name: "dim", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='resources/MindustryModPng2_madeByMinxyzgo.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
            time: n(0),
            num: [null, zero, zero, zero, zero, zero, zero, zero, zero],
            proc: [null, zero, zero, zero, zero, zero, zero, zero, zero],
            currentMM: n(0),

            c11: n(0),
        }
    },
    mmeff(x = player.mm.points) {
        var dim = x.div(2.5).add(1).log10().add(1)
        return dim
    },
    getDimMult(x) {
        var mult = expPow(player.m.points.add(10).log10().pow(2).mul(player.m.time.add(10).log10().pow(1.5)), 1.6).root((x + 1) ** 0.5).pow(buyableEffect('m', 22).sqrt()).pow(this.mmeff())
        if (hasAchievement('overflow', 32)) mult = mult.mul(buyableEffect('i', 12).sqrt())
        if(hasAchievement("overflow",33)) mult = mult.mul(achievementEffect("overflow",33))
        return mult.div(10)
    },
    getProcMult(x) {
        var mult = player.dim.proc[x]
        return mult
    },
    getDimNerf() {
        var nerf = n(2)
        return nerf
    },
    effect() {
        var eff = expPow(player.dim.points.add(1).log10().div(5).pow(1.75).add(10), 2).sub(9)
        return eff
    },
    effectDescription() {
        return `<br> 未使用的元元使得弦基础倍率^${format(this.mmeff())}(留这个远不如点升级).<br>
          倍率基于加速子,时间和元性质提高<br>
          弦使得元性质x${format(this.effect())}`
    },
    color: "white",
    resource: "弦", // Name of prestige currency
    type: "none",
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    layerShown() { return hasUpgrade('mm', 21) },
    tabFormat: [
        "main-display",
        ["blank", "25px"],

        ["display-text", function () { return `一维弦: x${format(layers.dim.getDimMult(1))} 弦产量x${format(layers.dim.getProcMult(1))}              数量：${format(player.dim.num[1])}` }],
        ["display-text", function () { return `二维弦: x${format(layers.dim.getDimMult(2))} 弦产量x${format(layers.dim.getProcMult(2))}              数量：${format(player.dim.num[2])}` }],
        ["display-text", function () { return `三维弦: x${format(layers.dim.getDimMult(3))} 弦产量x${format(layers.dim.getProcMult(3))}              数量：${format(player.dim.num[3])}` }],
        ["display-text", function () { return `四维弦: x${format(layers.dim.getDimMult(4))} 弦产量x${format(layers.dim.getProcMult(4))}              数量：${format(player.dim.num[4])}` }],
        ["display-text", function () { return `五维弦: x${format(layers.dim.getDimMult(5))} 弦产量x${format(layers.dim.getProcMult(5))}              数量：${format(player.dim.num[5])}` }],
        ["display-text", function () { return `六维弦: x${format(layers.dim.getDimMult(6))} 弦产量x${format(layers.dim.getProcMult(6))}              数量：${format(player.dim.num[6])}` }],
        ["display-text", function () { return `七维弦: x${format(layers.dim.getDimMult(7))} 弦产量x${format(layers.dim.getProcMult(7))}              数量：${format(player.dim.num[7])}` }],
        ["display-text", function () { return `八维弦: x${format(layers.dim.getDimMult(8))} 弦产量x${format(layers.dim.getProcMult(8))}              数量：${format(player.dim.num[8])}` }],

        ["blank", "25px"],
        "buyables", "challenges",
    ],
    update(diff) {
        if (!player.dim.currentMM.eq(player.mm.points)) {
            doReset(this.layer, 'mm')
            player.dim.currentMM = player.mm.points
        }
        if (!this.layerShown()) return

        var Dim8ProcSpeed = n(0.25)
        if (hasAchievement('overflow', 12)) Dim8ProcSpeed = Dim8ProcSpeed.mul(expPow(player.dim.num[1].add(1).log10().add(10), 2).sub(9))

        player.dim.num[8] = player.dim.num[8].add(Dim8ProcSpeed.mul(diff))
        for (i = 7; i >= 1; i--) {
            player.dim.num[i] = player.dim.num[i].add(player.dim.num[i + 1].mul(this.getDimMult(i + 1)).root(this.getDimNerf()).mul(diff))
        }
        var proc = one
        for (i = 8; i >= 1; i--) {
            player.dim.proc[i] = player.dim.proc[i].add(player.dim.num[i].mul(this.getDimMult(i)).mul(diff).div(10))
            proc = proc.mul(this.getProcMult(i))
        }
        player.dim.points = player.dim.points.add(proc)

        if (player[this.layer].activeChallenge != null) {
            player[this.layer]['c' + player[this.layer].activeChallenge] = player[this.layer]['c' + player[this.layer].activeChallenge].max(layers[this.layer].challenges[player[this.layer].activeChallenge].resource())
        }
    },
    challenges: {
        11: {
            name: '时间膨胀',
            challengeDescription: '元性质数量归零(可以重新获得),时间浓缩失效.*进入弦挑战保留你当前弦维度数量!',
            rewardDescription() { return `当前最高${format(getCP(this.layer, 11))},元元升级11底数x${format(this.rewardEffect())}` },
            rewardEffect() { return expRoot(getCP(this.layer, 11).div(1e64).add(1).root(25), 1.25) },
            goal: n(1e64),
            canComplete() { return player.dim.points.gte(this.goal) },
            onEnter() { player.dim.proc = [null, zero, zero, zero, zero, zero, zero, zero, zero]; player.m.points = zero; player.points = zero; player.m.time = zero; player.dim.points = zero; player.m.resetTime = 0 },
            resource() { return player.dim.points },
            unlocked() { return hasAchievement('overflow', 12) },
        },
    },
    doReset(layer) {
        if (layer == this.layer || layers[layer].row > 1) {
            layerDataReset(this.layer, ['c11'])
            //player.dim.num = [null,zero,zero,zero,zero,zero,zero,zero,zero]
        }
        if (layers[layer].row > 2) layerDataReset(this.layer, [])
    },
})
