//废案,考虑下次独立做树

function getEventName(id){
  return eventList[id].name()
}
function isEvent(id,name){
  return eventList[id].name()==name
}
function getTalentName(id){
  return talentList[id].name()
}
function isTalent(id,name){
  return talentList[id].name()==name
}
function hasTalent(name){
  return isTalent(player.life.t1,name)||isTalent(player.life.t2,name)||isTalent(player.life.tn1,name)||isTalent(player.life.tn2,name)||isTalent(player.life.tn3,name)
}
function getColorName(color){
  switch(color){
    case 'white':return '白'
    case 'lightblue':return '蓝'
  }
}

var talentList = [
  {
    name(){return '无'},
    desp(){return '你不配有天赋.'},
    shown(){return true},
    chance(){return n(0)},
    unlocked(){return true},
    color(){return 'white'},
    call(){},
  },
  {
    name(){return '眼尖'},
    desp(){return '你有更高的概率捡到钱.'},
    shown(){return true},
    chance(){return n(0)},
    unlocked(){return true},
    color(){return 'white'},
    call(){},
  },
  {
    name(){return '才富五车'},
    desp(){return '你的才能能够填满五辆玩具车.(智力+2).'},
    shown(){return true},
    chance(){return n(0)},
    unlocked(){return true},
    color(){return 'white'},
    call(){player.life.int = player.life.int.add(2)},
  },
  {
    name(){return 'NG-'},
    desp(){return '您正在游玩ng-模式.(全属性-4).'},
    shown(){return true},
    chance(){return n(1)},
    unlocked(){return true},
    color(){return 'lightblue'},
    call(){
      player.life.int = player.life.int.sub(4)
      player.life.str = player.life.str.sub(4)
      player.life.cha = player.life.cha.sub(4)
      player.life.wth = player.life.wth.sub(4)
    },
  },
  {
    name(){return '赌徒'},
    desp(){return '属性随机-2~+2.触发部分事件概率升高.'},
    shown(){return true},
    chance(){return n(1.5)},
    unlocked(){return true},
    color(){return 'lightblue'},
    call(){
      player.life.int = player.life.int.add(Math.random()*4-2)
      player.life.str = player.life.str.add(Math.random()*4-2)
      player.life.cha = player.life.cha.add(Math.random()*4-2)
      player.life.wth = player.life.wth.add(Math.random()*4-2)
    },
  },
  {
    name(){return '投个好胎'},
    desp(){return '家境+4.'},
    shown(){return true},
    chance(){return n(2)},
    unlocked(){return true},
    color(){return 'lightblue'},
    call(){
      player.life.wth = player.life.wth.add(4)
    },
  },
]
var totalTalent = 0
for(i in talentList) totalTalent ++

var eventList = [
  {
    desp(){return '无事发生.'},
    shown(){return false},
    chance(){return n(0)},//这里的概率为真实概率的倒数-1!
    unlocked(){return true},
    call(){},
  },
  {
    desp(){return '你在马路边捡到一块钱.'},
    shown(){return true},
    chance(){
      var baseChance = n(9)
      if(hasTalent('眼尖')) baseChance = baseChance.div(1.5)
      return baseChance
    },
    unlocked(){return true},
    call(){player.life.wth = player.life.wth.add(0.01)},
  },
  {
    desp(){return `你因病而死.`},
    shown(){return true},
    chance(){
      var baseChance = n(10000)
      if(player.life.str.gte(0)) baseChance = baseChance.mul(n(1.5).pow(player.life.str.root(1.33)))
      else baseChance = baseChance.div(n(1.5).pow(n(0).sub(player.life.str).root(1.33)))
      if(player.life.wth.gte(0)) baseChance = baseChance.mul(n(1.25).pow(player.life.wth.root(1.33)))
      else baseChance = baseChance.div(n(1.25).pow(n(0).sub(player.life.wth).root(1.33)))
      baseChance = baseChance.root(player.life.age.div(80).pow(1.25).add(1).pow(1.2)).div(player.life.age.div(80).add(1).pow(2))
      return baseChance
    },
    unlocked(){return true},
    call(){player.life.death = true},
  },
  {
    desp(){return `你熬夜肝游戏猝死.`},
    shown(){return true},
    chance(){
      var baseChance = n(100000)
      if(player.life.wth.gte(0)) baseChance = baseChance.div(n(1.75).pow(player.life.wth.root(1.5)))
      else baseChance = baseChance.mul(n(1.75).pow(n(0).sub(player.life.wth).root(1.5)))
      
      if(player.life.int.gte(0)) baseChance = baseChance.mul(n(1.5).pow(player.life.int.root(1.2).sub(4)))
      else baseChance = baseChance.div(n(1.5).pow(n(0).sub(player.life.int).root(1.2).add(4)))
      
      if(player.life.age.gt(16)) baseChance = baseChance.mul(player.life.age.sub(16).pow(1.4).add(1))
      else baseChance = baseChance.mul(n(16).sub(player.life.age).pow(2).add(1))
      return baseChance
    },
    unlocked(){return true},
    call(){player.life.death = true},
  },
  {
    desp(){return '你氪金抽卡.'},
    shown(){return true},
    chance(){
      var baseChance = n(10000)
      if(hasTalent('赌徒')) baseChance = baseChance.div(4)

      if(player.life.wth.gte(0)) baseChance = baseChance.div(n(1.625).pow(player.life.wth.root(1.5)))
      else baseChance = baseChance.mul(n(1.625).pow(n(0).sub(player.life.wth).root(1.5)))
      
      if(player.life.int.gte(0)) baseChance = baseChance.mul(n(1.5).pow(player.life.int.root(1.2).sub(4)))
      else baseChance = baseChance.div(n(1.5).pow(n(0).sub(player.life.int).root(1.2).add(4)))
      
      if(player.life.age.gt(16)) baseChance = baseChance.mul(player.life.age.sub(16).pow(1.4).add(1))
      else baseChance = baseChance.mul(n(16).sub(player.life.age).pow(2).add(1))
      
      return baseChance
    },
    unlocked(){return true},
    call(){player.life.wth = player.life.wth.sub(1)},
  },
  {
    desp(){return '你买彩票看看运气,中了...谢谢参与.'},
    shown(){return true},
    chance(){
      var baseChance = n(1000)
      if(player.life.wth.gte(0)) baseChance = baseChance.div(n(1.625).pow(player.life.wth.root(1.5)))
      else baseChance = baseChance.mul(n(1.625).pow(n(0).sub(player.life.wth).root(1.5)))
      
      if(player.life.int.gte(0)) baseChance = baseChance.mul(n(1.5).pow(player.life.int.root(1.2).sub(4)))
      else baseChance = baseChance.div(n(1.5).pow(n(0).sub(player.life.int).root(1.2).add(4)))
      
      if(player.life.age.gt(16)) baseChance = baseChance.mul(player.life.age.sub(16).pow(1.4).add(1))
      else baseChance = baseChance.mul(n(16).sub(player.life.age).pow(2).add(1))
      
      return baseChance
    },
    unlocked(){return true},
    call(){player.life.wth = player.life.wth.sub(0.1)},
  },
  {
    desp(){return '你找到了一份工作-搬砖.'},
    shown(){return true},
    chance(){
      var baseChance = n(1000)
      if(player.life.wth.gte(0)) baseChance = baseChance.mul(n(1.625).pow(player.life.wth.root(1.5)))
      else baseChance = baseChance.div(n(1.625).pow(n(0).sub(player.life.wth).root(1.5)))
      
      if(player.life.int.gte(0)) baseChance = baseChance.mul(n(1.8).pow(player.life.int.root(1.2)))
      else baseChance = baseChance.div(n(1.8).pow(n(0).sub(player.life.int).root(1.2)))
      
      if(player.life.age.gt(20)) baseChance = baseChance.mul(player.life.age.sub(20).add(1).root(2))
      else baseChance = baseChance.mul(n(20).sub(player.life.age).pow(3).add(1))
      
      return baseChance
    },
    unlocked(){return true},
    call(){
      player.life.work = "搬砖"
      player.life.salary = n(0.01)
    },
  },
]
var totalEvent = 0
for(i in eventList) totalEvent ++

addLayer("life", {
    name: "lifeResetart", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "$",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
		    
		    p1:n(0),t1:0,//px:轮回点,tx:天赋 此处为过去的几次继承的点数/天赋(未制作)
		    p2:n(0),t2:0,
		    
		    log1:``,//过去事件记录
		    log2:``,
		    log3:``,
		    log4:``,
		    log5:``,
		    
		    timer:n(0),
		    
		    str:n(0),int:n(0),cha:n(0),wth:n(0),
		    inSim:false,
		    age:n(0),
		    tn1:0,tn2:0,tn3:0,//当前天赋
		    sex:'无',
		    death:false,
        work:"无",salary:n(0),
		}},
    updateDelay(){
      return n(2)
    },
    color: "lime",
    resource: "轮回点",
    type: "none",
    row: 0,
    layerShown(){return hasAchievement('overflow',21)},
    clickables: {
        11: {
            canClick(){return true},
            display() {return `开始一轮轮回.`},
            onClick(){
              layerDataReset(this.layer,['points','total','best','p1','t1','p2','t2'])
              player.life.inSim = true
              var randomTalent = []
              var randomTalentID = []
              var str = ``
              for(i=1;i<=10;i++){
                var chance = n(1.79e308)
                var talent = null
                var triedTimes = 0
                var unlocked = false
                var id = 0
                while((chance.add(1).rec().lt(Math.random()) || !unlocked)&&triedTimes<25){
                  id = Math.floor(Math.random()*totalTalent)
                  talent = talentList[id]
                  chance = talent.chance()
                  unlocked = talent.unlocked()
                  triedTimes++
                }
                if(triedTimes>=25){
                  talent = talentList[0]
                  id = 0
                }
                randomTalent.push(talent)
                randomTalentID.push(id)
                var colorName = getColorName(talent.color())
                str += `\n${i-1}: ${talent.name()}(${colorName}) ${talent.desp()}`
              }
              var error = true
              var input = '000'
              while(error){
                input = prompt(`请选择三个你想要的天赋.直接输入对应序号,无需间隔符.例如:215.${str}`)
                if(input!=null){
                  error = false
                  if(input.length != 3) error = true
                  else if(input[0]==input[1]||input[0]==input[2]||input[1]==input[2]) error = true
                }
              }
              player.life.tn1 = randomTalentID[Number(input[0])]
              player.life.tn2 = randomTalentID[Number(input[1])]
              player.life.tn3 = randomTalentID[Number(input[2])]
              player.life.timer = n(0)
              randomTalent[Number(input[0])].call()
              randomTalent[Number(input[1])].call()
              randomTalent[Number(input[2])].call()
            }
        },
    },
    tabFormat: [
        "main-display",
        ["blank", "25px"],
        "clickables",
        ["display-text", function(){
          return `天赋1:${talentList[player.life.tn1].name()} ${talentList[player.life.tn1].desp()}`
        },{height:'50px'}],
        ["display-text", function(){
          return `天赋2:${talentList[player.life.tn2].name()} ${talentList[player.life.tn2].desp()}`
        },{height:'50px'}],
        ["display-text", function(){
          return `天赋3:${talentList[player.life.tn3].name()} ${talentList[player.life.tn3].desp()}`
        },{height:'50px'}],
        ["blank", "25px"],
        ["display-text", function(){
          return `体质${format(player.life.str)} | 智力${format(player.life.int)} | 魅力${format(player.life.cha)} | 家境${format(player.life.wth)} | 年龄${format(player.life.age)}`
        },{height:'50px',color:'lightblue'}],
        ["display-text", function(){
          if(player.life.death) return `已死亡`
          return ''
        },{height:'50px',color:'red'}],
        ["blank", "25px"],
        ["display-text", function(){
          return `${player.life.log1}<br><br>${player.life.log2}<br><br>${player.life.log3}<br><br>${player.life.log4}<br><br>${player.life.log5}<br><br>`
        },{height:'500px'}],
        ["blank", "25px"],
        "buyables","challenges",
    ],
    update(diff){
      if(player.life.death||!player.life.inSim) return
      player.life.timer = player.life.timer.add(diff)
      if(player.life.timer.gte(this.updateDelay())){
        player.life.timer = player.life.timer.sub(this.updateDelay())
        if(player.life.age.gte(1)){
        //随机事件
        var chance = n(1.79e308)
        var event = null
        var triedTimes = 0
        var unlocked = false
        while((chance.add(1).rec().lt(Math.random()) || !unlocked)&&triedTimes<25){
          event = eventList[Math.floor(Math.random()*totalEvent)]
          chance = event.chance()
          unlocked = event.unlocked()
          triedTimes++
        }
        if(triedTimes >= 25) event = eventList[0]
        event.call()
        if(event.shown()){
          for(i=1;i<=4;i++){
            player.life['log'+i] = player.life['log'+(i+1)]
          }
          player.life.log5 = ` ${formatWhole(player.life.age)}岁: ${event.desp()}`
        }
        if(!player.life.death) player.life.age = player.life.age.add(1)
        if(!player.life.death) player.life.wth = player.life.wth.add(player.life.salary)
      }else{
        player.life.age = n(1)
        var sex = Math.random()>0.5
        for(i=1;i<=4;i++){
            player.life['log'+i] = player.life['log'+(i+1)]
          }
        player.life.log5 = ` ${formatWhole(player.life.age)}岁: 你出生了,是个${sex?'男':'女'}孩.`
        player.life.sex = sex?'男':'女'
      }
      }
    },
})