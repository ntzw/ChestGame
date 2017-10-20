# 用TypeScript来写推箱子游戏
## 先介绍下TypeScript
> [TypeScript](https://www.tslang.cn/index.html) 是JavaScript类型的超集，可以编译成纯JavaScript，由微软开发。类型允许JavaScript开发者在开发JavaScript应用程序时使用高效的开发工具和常用操作比如静态检查和代码重构。  

## 讲讲游戏
[推箱子](https://baike.baidu.com/item/%E6%8E%A8%E7%AE%B1%E5%AD%90/9932066?fr=aladdin)游戏，在一个狭小的仓库中，要求把木箱放到指定的位置，稍不小心就会出现箱子无法移动或者通道被堵住的情况，所以需要巧妙的利用有限的空间和通道，合理安排移动的次序和位置，才能顺利的完成任务。

#### 使用的技术栈
Vue —用来渲染游戏
TypeScript —实现游戏逻辑

**地图**
游戏中的地图，我使用的是`number[][]`一个二维数组来表示。一维数组的下标表示坐标系的Y轴，二维数组的下标表示坐标系的X轴，二维数组的值是改坐标点表示的元素角色，根据不同的角色去渲染。
```javascript
/**
* 地图坐标点角色
*/
enum Role {
    /**
     * 空白
     */
    Blank,
    /**
     * 墙
     */
    Wall,
    /**
     * 小人
     */
    People,
    /**
     * 站在点上小人
     */
    PeopleDot,
    /**
     * 箱子
     */
    Chest,
    /**
     * 箱子点
     */
    Dot,
    /**
     * 到点的箱子
     */
    ChestDot
}
```

代码中，我用一个`Map`类封装保存当前地图的状态和一些常用方法，比如当前关卡的层级、所有关卡的初始地图数据。

界面用vue去渲染
```html
<template v-for="(yItem,y) in Map">
<ul>
    <li v-for="(xItem,x) in yItem" @click="SetRole(y,x)">
        <div :class="getRoleClass(xItem)" style="width:100%;height:100%;" :title="xItem" :key="y + '-' + x"></div>
    </li>
</ul>
<div style="clear:both;"></div>
</template>
```

**小人**
小人需要上、下、左、右的四处移动，并且移动之前还需要判断，如果是墙就不能移动；如果是箱子，就需要推动箱子。这也是推箱子游戏中核心的功能逻辑。所以在代码中，用一个`People`类来封装，保存小人当前的坐标和移动操作。
```javascript
class People {
    private currentCoord: Coord;
    constructor(coord: Coord) {
        this.currentCoord = coord;
    }

    private getNewCoord(oldCoord: Coord, potion: MovePotion): Coord {
        let newCoord: Coord = {
            Y: oldCoord.Y,
            X: oldCoord.X
        }
        switch (potion) {
            case MovePotion.Up:
                newCoord.Y--;
                break;
            case MovePotion.Right:
                newCoord.X++;
                break;
            case MovePotion.Down:
                newCoord.Y++;
                break;
            case MovePotion.Left:
                newCoord.X--;
                break;
        }

        return newCoord;
    }

    setCoord(coord: Coord) {
        this.currentCoord.Y = coord.Y;
        this.currentCoord.X = coord.X;
    }

    /**
     * 移动小人
     * @param potion 移动方向
     */
    move(potion: MovePotion) {
        let peopleNewCoord: Coord = this.getNewCoord(this.currentCoord, potion);
        let currentCoordRole: Role = game.getCoordRole(this.currentCoord);
        let newCoordRole: Role = game.getCoordRole(peopleNewCoord);
        if (!(newCoordRole == Role.Blank || newCoordRole == Role.Chest || newCoordRole == Role.Dot || newCoordRole == Role.ChestDot))
            return;

        let updateCurrentCoord = () => {
            this.currentCoord.Y = peopleNewCoord.Y;
            this.currentCoord.X = peopleNewCoord.X;
            game.addPace();
        }

        if (newCoordRole == Role.Blank) {
            game.setCoordRole(peopleNewCoord, Role.People);
            game.setCoordRole(this.currentCoord, currentCoordRole == Role.PeopleDot ? Role.Dot : Role.Blank);
            updateCurrentCoord();
        } else if (newCoordRole == Role.Dot) {
            game.setCoordRole(peopleNewCoord, Role.PeopleDot);
            game.setCoordRole(this.currentCoord, currentCoordRole == Role.PeopleDot ? Role.Dot : Role.Blank);
            updateCurrentCoord();
        } else if (newCoordRole == Role.Chest || newCoordRole == Role.ChestDot) {
            let newChestCoord: Coord = this.getNewCoord(peopleNewCoord, potion);
            let newChestCoordRole: Role = game.getCoordRole(newChestCoord);
            if (newChestCoordRole == Role.Wall || newChestCoordRole == Role.ChestDot || newChestCoordRole == Role.Chest)
                return;

            game.setCoordRole(newChestCoord, newChestCoordRole == Role.Dot ? Role.ChestDot : Role.Chest);
            game.setCoordRole(peopleNewCoord, newCoordRole == Role.ChestDot ? Role.PeopleDot : Role.People);
            game.setCoordRole(this.currentCoord, currentCoordRole == Role.PeopleDot ? Role.Dot : Role.Blank);
            updateCurrentCoord();
        }

        game.verifySuccess();
    }
}
```

**游戏交互**
最后用一个`Game`类来封装游戏的渲染、交互等，用Vue给方向键绑定点击事件。

**写在最后**
总的来说，用TypeScript来开发JavaScript项目，是一个不错的选择，既有了类型检查，又不会失去JavaScript语言的灵活性。在加上VS Code IDE的智能感知，开发起来方便快速。

[GitHub](https://github.com/ntzw/ChestGame)
[演示地址](http://animebz.com/game/chest.html)




#program-life/log