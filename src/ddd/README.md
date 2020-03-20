# 领域驱动模型

![ddd模型](ddd模型+依赖倒置.jpg)

## 参考
- [ddd-car](https://github.com/Sayi/ddd-cargo)

---

## 通用架构

**用户接口层**

> 负责向用户展现信息

```typescript
class CarController {
  private carQueryService: CarQueryService;
  private carCmdService: CarCommandService;

  constructor(...args) {
    // ...
  }

  public book(carInfo: CarInfo): void {
    carCmdService.book(carInfo);
  }

  public update(carId: string, info: CarInfo): void {
    carCmdService.update(carId, info);
  }

  public cargo(carId: string): Car {
    return carQueryService.queryById(carId);
  }
}
```

**应用服务层**

> 协调应用内的活动，可以做流程编排，通用流程可以抽象、固化
>
> 不包含业务逻辑，不保留业务对象的状态，仅保留业务进度状态
>
> 通常的处理流程：
>
> 1. 校验
>
> 2. 协调领域模型或者领域服务
>
> 3. 持久化
>
> 4. 发布领域事件
>

```typescript
class CarCmdServiceImplement implements CarCmdService {
  private carRepository: CarRepository;
  private eventPublisher: EventPublisher;

  public book(carInfo: CarInfo): void {
    // validate

    // create
    const car: Car = Car.newCar(CarDomainService.newCarId(), carInfo);
    // save
    cargoRepository.save(car);
    // publish event
    eventPublisher.publish(car);
  }

  public update(carId: string, info: CarInfo): void {
    // validate
    CarDomainService.validate(info);
    // find
    const car: Car = cargoRepository.find(carId);
    // update
    car.update(info);
    // save
    cargoRepository.save(car);
    // publish event
    eventPublisher.publish(car);
  }
}
```

```typescript
class CarQueryServiceImplement implements CarQueryService {
  private carMapper: CarMapper;

  public queryById(): Car {
    const car: Car = carMapper.select(id);
    return car;
  }
}
```

**领域层**

> 业务核心，包含关于领域的信息
>
> 主要包含：
>
> 1. 领域模型（单个聚合根、模型）
>
> 2. 领域服务（静态方法、涉及多个聚合配合的业务、外部服务处理业务）的状态
>

```typescript
// 领域模型
class Car {
  private id: String;
  private color: String;
  private description: String;

  constructor(carId: string, carInfo: CarInfo) {
    this.id = carId;
    this.color = carInfo.color;
    this.description = carInfo.description;
  }

  public static newCar(carId: string, carInfo: CarInfo): Car {
    const car: Car = new Car(carId, carInfo);
    return car;
  }
}
```

```typescript
class CarDomainService {
  public static PREFIX: string = 'mycar';

  public static newCarId(): string {
    return CarDomainService.PREFIX + Math.random().toString(32);
  }

  public static validate(carInfo: CarInfo): void {
    if (!carInfo.color || !carInfo.description) {
      throw new Error('缺少必要参数');
    }
  }
}
```

**基础设施层**

>
> 作为其他层的支撑层
>
> 实现业务对象的持久化，提供各层通信、防腐
>

```typescript
class CarRepositoryImplement implements CarRepository {
  private carMapper: CarMapper;

  public find(id: string): Car {
    const car: Car = carMapper.select(id);
    return car;
  }

  public save(car: Car): void {
    // ...
  }
}
```

---

## 要素

**实体(Entity)**

> 具有唯一标识的基本元素（class）

**值对象(Value Object)**

> 没有唯一标识的实体（class.getInstance()）


**服务(Service)**

> 无状态，无属性，提供便捷方法，具有行为，行为无状态（Utils）
>
> 但是行为不属于任何实体或对象，能涉及多个对象，
>

**模块(Module)**

> 应当包含统一接口供外部调用，
>
> 通过组织模块，降低模型复杂度（mixins）

**聚合(Aggregates)**

> 是一个典型的命令模型
>
> 每个聚合都有一个根实体，叫聚合根，在聚合中，聚合根是唯一允许外部引用的元素，
>
> 聚合内部的对象可以互相引用，外部只能看到聚合根
>

**工厂(Factory)**

> 封装复杂对象的创建过程（复杂class）
>
> 聚合的根创建后，聚合包含的对象也随之创建
> 

**资源库(Repositories)**

> 封装所有获取对象引用的逻辑，是全局存储点（storage）
>
> 与DAO的区别：DAO包含了从数据库提取数据，是资源库的下层
>
> 与工厂的区别：工厂创建对象，资源库保存已创建的对象
>

---

## 概念

### 命令和查询职责分离--CQRS

可以将领域模型分为：`命令模型（Command）`和`查询模型（Read）`

**命令模型**

>
> 可以修改对象状态，但是不能返回数据
>
> 命令模型是有副作用的
>

**查询模型**

>
> 可以返回数据，但是不能直接或间接修改对象状态
>
> 查询模型无副作用（总是能返回固定结果）
>

