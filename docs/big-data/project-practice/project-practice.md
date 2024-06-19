---
title: 离线数仓--新能源汽车数仓
tags: [大数据, 实战]
---

## 日志数据与维度表

在我们的 MySQL 中只需要存储维度数据

![alt text](./imgs/data-table.png)

## ODS 层

ODS 层（Operation Data Store 原始数据层）是数据仓库的最底层，存储原始数据，数据仓库中的数据都是从 ODS 层抽取出来的。

设计要点如下：

1. ODS 层的表结构设计依托于从业务系统同步过来的数据结构。
2. ODS 层要保存全部历史数据，故其压缩格式应选择压缩比较高的，此处选择 `gzip`。
3. ODS 层表名的命名规范为：ods*表名*单分区增量全量标识`（inc/full）`。

### 车辆日志表（增量表）

日志表由于信息经常发生变化，需要不断的新增数据，所以这里我们使用增量表来进行存储。

```sql {15-24} showLineNumbers
CREATE EXTERNAL TABLE ods_car_data_inc (
    `vin` STRING COMMENT '汽车唯一ID',
    `car_status` INT COMMENT '车辆状态',
    `charge_status` INT COMMENT '充电状态',
    `execution_mode` INT COMMENT '运行模式',
    `velocity` INT COMMENT '车速',
    `mileage` INT COMMENT '里程',
    `voltage` INT COMMENT '总电压',
    `electric_current` INT COMMENT '总电流',
    `soc` INT COMMENT 'SOC',
    `dc_status` INT COMMENT 'DC-DC 状态',
    `gear` INT COMMENT '挡位',
    `insulation_resistance` INT COMMENT '绝缘电阻',
    `motor_count` INT COMMENT '驱动电机个数',
    `motor_list` ARRAY<STRUCT<
        `id` INT,
        `status` INT,
        `rev` INT,
        `torque` INT,
        `controller_temperature` INT,
        `temperature` INT,
        `voltage` INT,
        `electric_current` INT
    >> COMMENT '驱动电机列表',
    `fuel_cell_voltage` INT COMMENT '燃料电池电压',
    `fuel_cell_current` INT COMMENT '燃料电池电流',
    `fuel_cell_consume_rate` INT COMMENT '燃料消耗率',
    `fuel_cell_temperature_probe_count` INT COMMENT '燃料电池温度探针总数',
    `fuel_cell_temperature` INT COMMENT '燃料电池温度值',
    `fuel_cell_max_temperature` INT COMMENT '氢系统中最高温度',
    `fuel_cell_max_temperature_probe_id` INT COMMENT '氢系统中最高温度探针号',
    `fuel_cell_max_hydrogen_consistency` INT COMMENT '氢气最高浓度',
    `fuel_cell_max_hydrogen_consistency_probe_id` INT COMMENT '氢气最高浓度传感器代号',
    `fuel_cell_max_hydrogen_pressure` INT COMMENT '氢气最高压力',
    `fuel_cell_max_hydrogen_pressure_probe_id` INT COMMENT '氢气最高压力传感器代号',
    `fuel_cell_dc_status` INT COMMENT '高压 DC-DC 状态',
    `engine_status` INT COMMENT '发动机状态',
    `crankshaft_speed` INT COMMENT '曲轴转速',
    `fuel_consume_rate` INT COMMENT '燃料消耗率',
    `max_voltage_battery_pack_id` INT COMMENT '最高电压电池子系统号',
    `max_voltage_battery_id` INT COMMENT '最高电压电池单体代号',
    `max_voltage` INT COMMENT '电池单体电压最高值',
    `min_temperature_subsystem_id` INT COMMENT '最低电压电池子系统号',
    `min_voltage_battery_id` INT COMMENT '最低电压电池单体代号',
    `min_voltage` INT COMMENT '电池单体电压最低值',
    `max_temperature_subsystem_id` INT COMMENT '最高温度子系统号',
    `max_temperature_probe_id` INT COMMENT '最高温度探针号',
    `max_temperature` INT COMMENT '最高温度值',
    `min_voltage_battery_pack_id` INT COMMENT '最低温度子系统号',
    `min_temperature_probe_id` INT COMMENT '最低温度探针号',
    `min_temperature` INT COMMENT '最低温度值',
    `alarm_level` INT COMMENT '报警级别',
    `alarm_sign` INT COMMENT '通用报警标志',
    `custom_battery_alarm_count` INT COMMENT '可充电储能装置故障总数 N1',
    `custom_battery_alarm_list` ARRAY<INT> COMMENT '可充电储能装置故障代码列表',
    `custom_motor_alarm_count` INT COMMENT '驱动电机故障总数 N2',
    `custom_motor_alarm_list` ARRAY<INT> COMMENT '驱动电机故障代码列表',
    `custom_engine_alarm_count` INT COMMENT '发动机故障总数 N3',
    `custom_engine_alarm_list` ARRAY<INT> COMMENT '发动机故障代码列表',
    `other_alarm_count` INT COMMENT '其他故障总数 N4',
    `other_alarm_list` ARRAY<INT> COMMENT '其他故障代码列表',
    `battery_count` INT COMMENT '单体电池总数',
    `battery_pack_count` INT COMMENT '单体电池包总数',
    `battery_voltages` ARRAY<INT> COMMENT '单体电池电压值列表',
    `battery_temperature_probe_count` INT COMMENT '单体电池温度探针总数',
    `battery_pack_temperature_count` INT COMMENT '单体电池包总数',
    `battery_temperatures` ARRAY<INT> COMMENT '单体电池温度值列表',
    `timestamp` BIGINT COMMENT '日志采集时间'
)
COMMENT '整车日志表'
PARTITIONED BY (
    `dt` STRING COMMENT '统计日期'
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.JsonSerDe'
LOCATION '/warehouse/car_data/ods/ods_car_data_inc';
```

需要重点学习的就是

```sql
`motor_list` ARRAY<STRUCT<
        `id` INT,
        `status` INT,
        `rev` INT,
        `torque` INT,
        `controller_temperature` INT,
        `temperature` INT,
        `voltage` INT,
        `electric_current` INT
    >> COMMENT '驱动电机列表',
```

驱动电机列表，其实可以理解为一个`ArrayList<电机>`即可。

### 汽车信息表（全量表）

汽车的维度信息很少会发生变化，因此我们选择全量表来存储汽车信息。

```sql
drop table if exists ods_car_info_full;
create external table ods_car_info_full
(
 `id` string comment '车辆唯一编码',
 `type_id` string comment '车型 ID',
 `type` string comment '车型',
 `sale_type` string comment '销售车型',
 `trademark` string comment '品牌',
 `company` string comment '厂商',
 `seating_capacity` int comment '准载人数',
 `power_type` string comment '车辆动力类型',
 `charge_type` string comment '车辆支持充电类型',
 `category` string comment '车辆分类',
 `weight_kg` int comment '总质量（kg）',
 `warranty` string comment '整车质保期（年/万公里）'
) comment '整车信息表'
 partitioned by (`dt` string comment '统计日期')
 row format delimited fields terminated by '\t'
 location '/warehouse/car_data/ods/ods_car_info_full';
```

### 数据装载脚本

即我们需要将每日的数据装载到对应的表中，这里的数据是来自于 Hadoop 中的，所有的数据已经存储到 Hadoop 中，再装载到 Hive 中，方便查询。

- 每日日志数据-->日志增量表
- 汽车维度数据-->汽车信息全量表

`hdfs-to-ods.sh`

```bash
#!/bin/bash

APP='car_data'

# 判断第二个参数是否填写 如果填写使用作为日期 如果没有填写 默认使用昨天作为日期
if [ -n "$2" ]; then
    do_date=$2
else
    do_date=$(date -d '-1 day' +%F)
fi

case "$1" in
    "ods_car_data_inc")
        hive -e "
            LOAD DATA INPATH '/origin_data/car_data_full/$do_date'
            INTO TABLE $APP.ods_car_data_inc PARTITION (dt='$do_date');
        "
        ;;
    "ods_car_info_full")
        hive -e "
            LOAD DATA INPATH '/origin_data/car_info_full/$do_date'
            INTO TABLE $APP.ods_car_info_full PARTITION (dt='$do_date');
        "
        ;;
    "all")
        hive -e "
            LOAD DATA INPATH '/origin_data/car_data_full/$do_date'
            INTO TABLE $APP.ods_car_data_inc PARTITION (dt='$do_date');
            LOAD DATA INPATH '/origin_data/car_info_full/$do_date'
            INTO TABLE $APP.ods_car_info_full PARTITION (dt='$do_date');
        "
        ;;
esac
```

然后再赋予脚本执行权限，再执行即可。

```bash
chmod +x hdfs-to-ods.sh
hdfs-to-ods all 2024-06-19
```

## DIM 层

DIM（Dimension） 层是公共维度层，存储模型中需要用到的所有维度信息。

设计要点：

1. DIM 层的设计依据是维度建模理论，该层存储维度模型的维度表。
2. DIM 层的数据存储格式为 orc 列式存储+snappy 压缩。
3. DIM 层表名的命名规范为 dim*表名*全量表或者拉链表标识（full/zip）

## DWD 层

DWD（Data Warehouse Detail） 层是数据仓库的明细层，存放维度模型中的事实表，<span style={{color:'red',fontWeight:'bold'}}>保存各个业务过程中的最小粒度的操作记录</span>。

设计要点：

1. DWD 层的设计依据是维度建模理论，该层存储维度模型的事实表。
2. DWD 层的数据存储格式为 orc 列式存储+snappy 压缩。
3. DWD 层表名的命名规范为 dwd*数据域*表名\_单分区增量全量标识（inc/full）

我们知道离线数仓的设计原理是根据最终想要展示的数据以及效果，从后向前逐步分析，最后得出离线数仓的架构设计。所以在我们的 DWD 的设计中，我们需要参考业务总线矩阵。

### 电动模式行驶日志

我们需要创建一个电动模式的形式日志表，该表的目的是为了记录车辆在行驶过程中产生的日志信息。所以我们使用增量表。

```sql
DROP TABLE IF EXISTS dwd_car_running_electricity_inc;

CREATE EXTERNAL TABLE dwd_car_running_electricity_inc (
    `vin` STRING COMMENT '汽车唯一ID',
    `velocity` INT COMMENT '车速',
    `mileage` INT COMMENT '里程',
    `voltage` INT COMMENT '总电压',
    `electric_current` INT COMMENT '总电流',
    `soc` INT COMMENT 'SOC',
    `dc_status` INT COMMENT 'DC-DC 状态',
    `gear` INT COMMENT '挡位',
    `insulation_resistance` INT COMMENT '绝缘电阻',
    `motor_count` INT COMMENT '驱动电机个数',
    `motor_list` ARRAY<STRUCT<
        `id` INT,
        `status` INT,
        `rev` INT,
        `torque` INT,
        `controller_temperature` INT,
        `temperature` INT,
        `voltage` INT,
        `electric_current` INT
    >> COMMENT '驱动电机列表',
    `fuel_cell_dc_status` INT COMMENT '高压 DC-DC 状态',
    `engine_status` INT COMMENT '发动机状态',
    `crankshaft_speed` INT COMMENT '曲轴转速',
    `fuel_consume_rate` INT COMMENT '燃料消耗率',
    `max_voltage_battery_pack_id` INT COMMENT '最高电压电池子系统号',
    `max_voltage_battery_id` INT COMMENT '最高电压电池单体代号',
    `max_voltage` INT COMMENT '电池单体电压最高值',
    `min_temperature_subsystem_id` INT COMMENT '最低电压电池子系统号',
    `min_voltage_battery_id` INT COMMENT '最低电压电池单体代号',
    `min_voltage` INT COMMENT '电池单体电压最低值',
    `max_temperature_subsystem_id` INT COMMENT '最高温度子系统号',
    `max_temperature_probe_id` INT COMMENT '最高温度探针号',
    `max_temperature` INT COMMENT '最高温度值',
    `min_voltage_battery_pack_id` INT COMMENT '最低温度子系统号',
    `min_temperature_probe_id` INT COMMENT '最低温度探针号',
    `min_temperature` INT COMMENT '最低温度值',
    `battery_count` INT COMMENT '单体电池总数',
    `battery_pack_count` INT COMMENT '单体电池包总数',
    `battery_voltages` ARRAY<INT> COMMENT '单体电池电压值列表',
    `battery_temperature_probe_count` INT COMMENT '单体电池温度探针总数',
    `battery_pack_temperature_count` INT COMMENT '单体电池包总数',
    `battery_temperatures` ARRAY<INT> COMMENT '单体电池温度值列表',
    `timestamp` BIGINT COMMENT '日志采集时间'
)
COMMENT '电动模式行驶日志事实表'
PARTITIONED BY (
    `dt` STRING COMMENT '统计日期'
)
STORED AS ORC
LOCATION '/warehouse/car_data/dwd/dwd_car_running_electricity_inc'
TBLPROPERTIES ('orc.compress' = 'snappy');
```

对于增量表，我们有两个阶段，首先要先进行首日装载，将以前的数据装载，然后正式上线运行后，每日的数据也需要装载。

### 首日装载

```sql {43} showLineNumbers
-- 首日装载
SET hive.exec.dynamic.partition.mode=nonstrict;

INSERT OVERWRITE TABLE car_data.dwd_car_running_electricity_inc
PARTITION(dt)
SELECT
    `vin`,
    `velocity`,
    `mileage`,
    `voltage`,
    `electric_current`,
    `soc`,
    `dc_status`,
    `gear`,
    `insulation_resistance`,
    `motor_count`,
    `motor_list`,
    `fuel_cell_dc_status`,
    `engine_status`,
    `crankshaft_speed`,
    `fuel_consume_rate`,
    `max_voltage_battery_pack_id`,
    `max_voltage_battery_id`,
    `max_voltage`,
    `min_temperature_subsystem_id`,
    `min_voltage_battery_id`,
    `min_voltage`,
    `max_temperature_subsystem_id`,
    `max_temperature_probe_id`,
    `max_temperature`,
    `min_voltage_battery_pack_id`,
    `min_temperature_probe_id`,
    `min_temperature`,
    `battery_count`,
    `battery_pack_count`,
    `battery_voltages`,
    `battery_temperature_probe_count`,
    `battery_pack_temperature_count`,
    `battery_temperatures`,
    `timestamp`,
    `dt`
FROM car_data.ods_car_data_inc
WHERE dt <= '2024-06-19'
  AND car_status = 1
  AND execution_mode = 1;
```

假定的上线时间为`2024-06-19`，我们可以看到，我们从 ods 层中查询了`06-19`前的所有数据，并且过滤了电动模式，然后将数据装载到`dwd_car_running_electricity_inc`表中。

### 每日装载

```sql {4,42} showLineNumbers
SET hive.exec.dynamic.partition.mode=nonstrict;

INSERT OVERWRITE TABLE car_data.dwd_car_running_electricity_inc
PARTITION(dt='2024-06-20')
SELECT
    `vin`,
    `velocity`,
    `mileage`,
    `voltage`,
    `electric_current`,
    `soc`,
    `dc_status`,
    `gear`,
    `insulation_resistance`,
    `motor_count`,
    `motor_list`,
    `fuel_cell_dc_status`,
    `engine_status`,
    `crankshaft_speed`,
    `fuel_consume_rate`,
    `max_voltage_battery_pack_id`,
    `max_voltage_battery_id`,
    `max_voltage`,
    `min_temperature_subsystem_id`,
    `min_voltage_battery_id`,
    `min_voltage`,
    `max_temperature_subsystem_id`,
    `max_temperature_probe_id`,
    `max_temperature`,
    `min_voltage_battery_pack_id`,
    `min_temperature_probe_id`,
    `min_temperature`,
    `battery_count`,
    `battery_pack_count`,
    `battery_voltages`,
    `battery_temperature_probe_count`,
    `battery_pack_temperature_count`,
    `battery_temperatures`,
    `timestamp`,
    `dt`
FROM car_data.ods_car_data_inc
WHERE dt = '2024-06-20'
  AND car_status = 1
  AND execution_mode = 1;
```

可以看到对于每日装载，我们只查询了`2024-06-20`的数据，并且过滤了电动模式，然后将数据装载到`dwd_car_running_electricity_inc`表中。

## DWS 层

DWS（Data Warehouse Summary）是数据汇总层，根据上层的业务需求，以分析主题为基础，对数据进行汇总，形成汇总表。

### 单次粒度汇总

#### 单次行程汇总表

建表语句

```sql
drop table if exists dws_electricity_single_trip_detail;
create external table dws_electricity_single_trip_detail
(
 `id` string comment '行程 id',
 `vin` string comment '汽车唯一编码',
 `start_timestamp` bigint comment '开始时间',
 `end_timestamp` bigint comment '结束时间',
 `start_mileage` int comment '开始里程',
 `end_mileage` int comment '结束里程',
 `start_soc` int comment '行程开始 soc, 单位：0.1%',
 `end_soc` int comment '行程结束 soc, 单位：0.1%',
 `avg_speed` decimal(16, 2) comment '平均时速',
 `car_avg_voltage` decimal(16, 2) comment '汽车平均电压',
 `car_avg_electric_current` decimal(16, 2) comment '汽车平均电流',
 `battery_avg_max_temperature` decimal(16, 2) comment '电池组最高温度的平均温度',
 `battery_mid_max_temperature` decimal(16, 2) comment '电池组最高温度的中位数',
 `battery_avg_min_temperature` decimal(16, 2) comment '电池组最低温度的平均温度',
 `battery_mid_min_temperature` decimal(16, 2) comment '电池组最低温度的中位数',
 `battery_avg_max_voltage` decimal(16, 2) comment '电池组最高电压的平均电压',
 `battery_mid_max_voltage` decimal(16, 2) comment '电池组最高电压的中位数',
 `battery_avg_min_voltage` decimal(16, 2) comment '电池组最低电压的平均电压',
 `battery_mid_min_voltage` decimal(16, 2) comment '电池组最低电压的中位数'
) comment '单次行程汇总表'
 partitioned by (`dt` string comment '统计日期')
 stored as orc
 location
'/warehouse/car_data/dws/dws_electricity_single_trip_detail'
 tblproperties ('orc.compress' = 'snappy');
```

在这个表中，即存储每日的每段的行程数据汇总。

```sql
INSERT OVERWRITE TABLE dws_electricity_single_trip_detail
PARTITION (dt)
SELECT
    CONCAT(vin, '-', MIN(`timestamp`)) AS id,
    vin,
    MIN(`timestamp`) AS start_timestamp,
    MAX(`timestamp`) AS end_timestamp,
    MIN(mileage) AS start_mileage,
    MAX(mileage) AS end_mileage,
    MAX(soc) AS start_soc,
    MIN(soc) AS end_soc,
    AVG(velocity) AS avg_speed,
    AVG(voltage) AS car_avg_voltage,
    AVG(electric_current) AS car_avg_electric_current,
    AVG(max_temperature) AS battery_avg_max_temperature,
    COLLECT_LIST(max_temperature)[CAST(COUNT(*) / 2 AS INT)] AS battery_mid_max_temperature,
    AVG(min_temperature) AS battery_avg_min_temperature,
    COLLECT_LIST(min_temperature)[CAST(COUNT(*) / 2 AS INT)] AS battery_mid_min_temperature,
    AVG(max_voltage) AS battery_avg_max_voltage,
    COLLECT_LIST(max_voltage)[CAST(COUNT(*) / 2 AS INT)] AS battery_mid_max_voltage,
    AVG(min_voltage) AS battery_avg_min_voltage,
    COLLECT_LIST(min_voltage)[CAST(COUNT(*) / 2 AS INT)] AS battery_mid_min_voltage,
    dt
FROM (
    SELECT
        vin,
        velocity,
        mileage,
        voltage,
        electric_current,
        soc,
        max_temperature,
        max_voltage,
        min_temperature,
        min_voltage,
        `timestamp`,
        dt,
        SUM(mark) OVER (PARTITION BY vin ORDER BY `timestamp`) AS singer_trip
    FROM (
        SELECT
            vin,
            velocity,
            mileage,
            voltage,
            electric_current,
            soc,
            max_temperature,
            max_voltage,
            min_temperature,
            min_voltage,
            `timestamp`,
            dt,
            IF((LAG(`timestamp`, 1, 0) OVER (PARTITION BY vin ORDER BY `timestamp`) - `timestamp`) < -60000, 1, 0) AS mark
        FROM dwd_car_running_electricity_inc
        WHERE dt <= '2023-05-02'
    ) t1
) t2
GROUP BY dt, vin, singer_trip;
```

下面就到了我们的重头戏，对这段代码进行详细的分析一下，首先来分析一下数据源的两个`select`语句

1. 首先是最内层的子查询（t1）：从表 dwd_car_running_electricity_inc 中选择数据，使用 LAG 函数计算相邻两条记录的时间差，如果时间差超过 60 秒（60000 毫秒），则标记 mark 为 1，否则为 0，时间标记 mark 用于区分不同的行程。

2. 然后是第二层的子查询（t2）：基于 vin 和 timestamp 分区，计算每个行程的标记 singer_trip，使用 SUM 汇总 mark 的值来作为行程标识 singer_trip`，可以理解为这段行程时长。

3. 主查询：聚合了车辆单次行程的各类统计信息，使用 CONCAT(vin, '-', MIN(\timestamp`))` 生成每个行程的唯一 ID，统计的字段包括行程开始和结束时间、里程、SOC、速度、电压、电流、温度等，通过子查询 t2 提供的 singer_trip 字段进行分组。


