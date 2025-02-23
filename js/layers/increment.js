addLayer("i", {
    name: "increment", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I",
    position: 1,
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
        }
    },
    color: "lime",
    resource: "增量点",
    type: "none",
    row: 2,
    layerShown() { return hasAchievement('overflow', 31) },
    effectDescription() {
        return `<h3>(+ ${format(layers.i.ipGain())} /s)</h3>`
    },
    buyables: {
        11: {
            costStat() {
                var stat = [n(60), n(1.325), n(1.0075)]
                return stat
            },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var costStat = this.costStat()
                return costStat[0].mul(costStat[1].pow(x)).mul(costStat[2].pow(x.pow(2)))
            },
            effect(x = getBuyableAmount(this.layer, this.id)) {
                x = x.add(this.extraLevel())
                var eff = expRoot(player.points.add(10).slog(10).log10().add(1).mul(10), 1.125).div(5).pow(x.add(1).cbrt())
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量+"
            },
            extraLevel() {
                var exLv = buyableEffect(this.layer, 21)
                exLv = exLv.add(buyableEffect(this.layer, 22).mul(getBuyableAmount(this.layer, 13)))
                return exLv
            },
            display() {
                return `加成点数获取.<br>
                + ${format(this.effect())} /s.<br>
                (下一级${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})
                <br>
                    等级:${format(player[this.layer].buyables[this.id])}${this.extraLevel().eq(0) ? '' : ` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buymax() {
                var costStat = this.costStat()
                var a = costStat[2].log10()
                var b = costStat[1].log10()
                var c = costStat[0].log10()
                var y = player[this.layer].points.log10()
                var x = b.pow(2).sub(a.mul(c.sub(y)).mul(4)).sqrt().sub(b).div(a.mul(2)).floor()
                if (x.gt(getBuyableAmount(this.layer, this.id)) && !x.isNaN()) setBuyableAmount(this.layer, this.id, x)
            },
            unlocked() { return true },
            abtick: 0,
            abdelay() { return 1.79e308 },
        },
        12: {
            costStat() {
                var stat = [n(24000), n(1.4), n(1.015)]
                return stat
            },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var costStat = this.costStat()
                return costStat[0].mul(costStat[1].pow(x)).mul(costStat[2].pow(x.pow(2)))
            },
            effect(x = getBuyableAmount(this.layer, this.id)) {
                x = x.add(this.extraLevel())
                var eff = expPow(player.m.points.add(1).log10().add(1).log10().add(1).mul(10), 1.2).div(10).pow(x.div(4))
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量x"
            },
            extraLevel() {
                var exLv = n(0)
                exLv = exLv.add(buyableEffect(this.layer, 22).mul(getBuyableAmount(this.layer, 13)))
                return exLv
            },
            display() {
                return `基于元性质,倍增增量点.<br>
                x ${format(this.effect())}.<br>
                (下一级${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br>
                    等级:${format(player[this.layer].buyables[this.id])}${this.extraLevel().eq(0) ? '' : ` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buymax() {
                var costStat = this.costStat()
                var a = costStat[2].log10()
                var b = costStat[1].log10()
                var c = costStat[0].log10()
                var y = player[this.layer].points.log10()
                var x = b.pow(2).sub(a.mul(c.sub(y)).mul(4)).sqrt().sub(b).div(a.mul(2)).floor()
                if (x.gt(getBuyableAmount(this.layer, this.id)) && !x.isNaN()) setBuyableAmount(this.layer, this.id, x)
            },
            unlocked() { return true },
            abtick: 0,
            abdelay() { return 1.79e308 },
        },
        13: {
            costStat() {
                var stat = [n(1e8), n(4), n(2)]
                return stat
            },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var costStat = this.costStat()
                return costStat[0].mul(costStat[1].pow(x)).mul(costStat[2].pow(x.pow(2)))
            },
            effect(x = getBuyableAmount(this.layer, this.id)) {
                x = x.add(this.extraLevel())
                var eff = player.mm.total.add(1).log10().add(player.overflow.total.add(1).div(2).add(2).log10()).div(10).add(1).pow(x.add(1).log10().add(1).pow(2).sub(1))
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量^"
            },
            extraLevel() {
                var exLv = n(0)
                return exLv
            },
            display() {
                return `基于元元和超限,指数增幅增量点.<br>
                ^ ${format(this.effect(), 4)}.<br>
                (下一级${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)), 4)})<br>
                    等级:${format(player[this.layer].buyables[this.id])}${this.extraLevel().eq(0) ? '' : ` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buymax() {
                var costStat = this.costStat()
                var a = costStat[2].log10()
                var b = costStat[1].log10()
                var c = costStat[0].log10()
                var y = player[this.layer].points.log10()
                var x = b.pow(2).sub(a.mul(c.sub(y)).mul(4)).sqrt().sub(b).div(a.mul(2)).floor()
                if (x.gt(getBuyableAmount(this.layer, this.id)) && !x.isNaN()) setBuyableAmount(this.layer, this.id, x)
            },
            unlocked() { return true },
            abtick: 0,
            abdelay() { return 1.79e308 },
        },
        21: {
            costStat() {
                var stat = [n(6e9), n(4), n(1.2)]
                return stat
            },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var costStat = this.costStat()
                return costStat[0].mul(costStat[1].pow(x)).mul(costStat[2].pow(x.pow(2)))
            },
            effect(x = getBuyableAmount(this.layer, this.id)) {
                x = x.add(this.extraLevel())
                var eff = expPow(buyableEffect('m', 22).log10().add(1).mul(10), 2.25).div(10).pow(2).pow(x.mul(3).add(1).log10().add(1).pow(1.6).sub(1)).sub(1)
                eff = powsoftcap(eff, n(100), 2)
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量Δt"
            },
            extraLevel() {
                var exLv = n(0)
                return exLv
            },
            display() {
                return `基于加速子增加“增量+”等级.<br>
                + ${format(this.effect(), 3)}.<br>
                (下一级${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)), 3)})<br>
                    等级:${format(player[this.layer].buyables[this.id])}${this.extraLevel().eq(0) ? '' : ` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buymax() {
                var costStat = this.costStat()
                var a = costStat[2].log10()
                var b = costStat[1].log10()
                var c = costStat[0].log10()
                var y = player[this.layer].points.log10()
                var x = b.pow(2).sub(a.mul(c.sub(y)).mul(4)).sqrt().sub(b).div(a.mul(2)).floor()
                if (x.gt(getBuyableAmount(this.layer, this.id)) && !x.isNaN()) setBuyableAmount(this.layer, this.id, x)
            },
            unlocked() { return true },
            abtick: 0,
            abdelay() { return 1.79e308 },
        },
        22: {
            costStat() {
                var stat = [n(6e10), n(10), n(2)]
                return stat
            },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var costStat = this.costStat()
                return costStat[0].mul(costStat[1].pow(x)).mul(costStat[2].pow(x.pow(2)))
            },
            effect(x = getBuyableAmount(this.layer, this.id)) {
                x = x.add(this.extraLevel())
                var eff = x.add(1).log10().add(1).pow(2).sub(1)
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量集合"
            },
            extraLevel() {
                var exLv = n(0)
                return exLv
            },
            display() {
                return `增量^给予增量+和x额外等级.<br>
                + ${format(this.effect(), 3)}/增量^.<br>
                (下一级${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)), 3)})<br>
                    等级:${format(player[this.layer].buyables[this.id])}${this.extraLevel().eq(0) ? '' : ` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buymax() {
                var costStat = this.costStat()
                var a = costStat[2].log10()
                var b = costStat[1].log10()
                var c = costStat[0].log10()
                var y = player[this.layer].points.log10()
                var x = b.pow(2).sub(a.mul(c.sub(y)).mul(4)).sqrt().sub(b).div(a.mul(2)).floor()
                if (x.gt(getBuyableAmount(this.layer, this.id)) && !x.isNaN()) setBuyableAmount(this.layer, this.id, x)
            },
            unlocked() { return true },
            abtick: 0,
            abdelay() { return 1.79e308 },
        },
        23: {
            costStat() {
                var stat = [n(1e4), n(4), n(1.01)]
                return stat
            },
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var costStat = this.costStat()
                return costStat[0].mul(costStat[1].pow(x)).mul(costStat[2].pow(x.pow(2)))
            },
            effect(x = getBuyableAmount(this.layer, this.id)) {
                x = x.add(this.extraLevel())
                var eff = x.add(10).log10()
                return eff
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "增量双指数(指数乘方)"
            },
            extraLevel() {
                var exLv = n(0)
                return exLv
            },
            display() {
                return `指数增幅“元性质增幅器”.<br>
                ^ ${format(this.effect(), 3)}.<br>
                (下一级${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)), 3)})<br>
                    等级:${format(player[this.layer].buyables[this.id])}${this.extraLevel().eq(0) ? '' : ` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 增量点`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buymax() {
                var costStat = this.costStat()
                var a = costStat[2].log10()
                var b = costStat[1].log10()
                var c = costStat[0].log10()
                var y = player[this.layer].points.log10()
                var x = b.pow(2).sub(a.mul(c.sub(y)).mul(4)).sqrt().sub(b).div(a.mul(2)).floor()
                if (x.gt(getBuyableAmount(this.layer, this.id)) && !x.isNaN()) setBuyableAmount(this.layer, this.id, x)
            },
            unlocked() { return true },
            abtick: 0,
            abdelay() { return 1.79e308 },
        },
    },
    ipGain() {
        var gain = buyableEffect(this.layer, 11)
        gain = gain.mul(buyableEffect(this.layer, 12))
        if (hasAchievement("overflow", 33)) gain = gain.mul(achievementEffect("overflow", 33))
        if (hasAchievement("overflow", 41)) gain = gain.mul(achievementEffect("overflow", 41))

        gain = gain.pow(buyableEffect(this.layer, 13))
        return gain
    },
    update(diff) {
        player.i.points = player.i.points.add(this.ipGain().mul(diff))
    },
})