---
title: 连表动态查询
sidebar_position: 3
tags:
  - Java
  - Mybatis
---

# 连表动态查询

## 常规方式

这种方法最开始借鉴于若依的查询方法，可以实现连表查询，并且使用条件判断语句来动态拼接 SQL 的 WHERE 部分，从而实现动态查询。

我们可以以我之前的一个后端例子来分析-->[恋爱盲盒](https://github.com/ssrskl/LoveBlindBoxBackend)

实体类主要有两个，一个是用户类，一个是卡片类。

LoveUser.java

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoveUser implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private Long userId;
    private String username;
    private String password;
    private String email;
    private Boolean status;
    private String avatat;
}
```

LoveStick.java

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoveStick implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private Long stickId;
    private Long publisherId;
    private Long receiverId;
    private int gender;
    private int age;
    private String qq;
    private String wechat;
    private String hobby;
    private String personality;
    private String introduction;
}
```

业务逻辑大概是一个卡片中会保存两个用户的 ID，那么我们在查询卡片的时候，需要连表查询出两个用户的信息，并且使用条件判断语句来动态拼接 SQL 的 WHERE 部分，从而实现动态查询。所以可以先构建一个 LoveStickDTO 类，用于接收查询结果，然后根据条件动态拼接 SQL 语句，

LoveStickDTO.java

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoveStickDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private Long stickId;
    private Long publisherId;
    private Long receiverId;
    private int gender;
    private int age;
    private String qq;
    private String wechat;
    private String hobby;
    private String personality;
    private String introduction;
    private LoveUser publisher;
    private LoveUser receiver;
}
```

然后我们需要在 LoveStickMapper.java 中定义一个方法，用于接收 LoveStickDTO 作为参数，并且动态拼接 SQL 语句。主要流程如下：

1. 构建一个 resultMap，用于映射查询结果
2. 构建一个 sql 语句，通过参数来动态拼接 SQL 语句
3. 执行查询操作
4. 返回查询结果

那么我们首先来构建一个 resultMap，用于映射查询结果。

```xml {} showLineNumbers
    <resultMap id="LoveStickDTOMap" type="com.maoyan.loveblindbox.entity.dto.LoveStickDTO">
        <result column="stick_id" property="stickId"/>
        <result column="publisher_id" property="publisherId"/>
        <result column="receiver_id" property="receiverId"/>
        <result column="gender" property="gender"/>
        <result column="age" property="age"/>
        <result column="qq" property="qq"/>
        <result column="wechat" property="wechat"/>
        <result column="hobby" property="hobby"/>
        <result column="personality" property="personality"/>
        <result column="introduction" property="introduction"/>
        <association property="publisher" javaType="com.maoyan.loveblindbox.entity.LoveUser">
            <result column="user_id" property="userId"/>
            <result column="username" property="username"/>
            <result column="email" property="email"/>
            <result column="status" property="status"/>
            <result column="avater" property="avater"/>
        </association>
        <association property="receiver" javaType="com.maoyan.loveblindbox.entity.LoveUser">
            <result column="r_user_id" property="userId"/>
            <result column="r_username" property="username"/>
            <result column="r_email" property="email"/>
            <result column="r_status" property="status"/>
            <result column="r_avater" property="avater"/>
        </association>
    </resultMap>
```

这里的关键点还是非常多的，我们一个一个来分析：
:::tips

1. 我们这里使用的是 resultMap，而不是 resulttype，这是因为在实际应用中，我们往往需要返回一个 DTO 对象，而不是一个实体对象。
2. 两个 association 标签分别用于映射两个用户的信息。**并且一定需要放在最后面！！！**
3. 由于两个都是用户类型，所以要对他们进行区分，所以将第二个接收者即 receiver 的列名前面加上 r\_前缀，以示区分。
   :::

然后我们来构建一个 sql 语句，通过参数来动态拼接 SQL 语句。

```sql
<select id="selectLoveStickDetailById" resultMap="LoveStickDTOMap">
        select love_stick.stick_id,
               love_stick.publisher_id,
               love_stick.receiver_id,
               love_stick.gender,
               love_stick.age,
               love_stick.qq,
               love_stick.wechat,
               love_stick.hobby,
               love_stick.personality,
               love_stick.introduction,
               publisher.user_id,
               publisher.username,
               publisher.email,
               publisher.status,
               publisher.avater,
               receiver.user_id  as r_user_id,
               receiver.username as r_username,
               receiver.email    as r_email,
               receiver.status   as r_status,
               receiver.avater   as r_avater
        from love_stick
                 left outer join love_user publisher on publisher.user_id = love_stick.publisher_id
                 left outer join love_user receiver on receiver.user_id = love_stick.receiver_id
        <where>
            and 1 = 1
            <if test="stickId != null">
                and love_stick.stick_id = #{stickId}
            </if>
            <if test="publisherId != null">
                and love_stick.publisher_id = #{publisherId}
            </if>
            <if test="receiverId != null">
                and love_stick.receiver_id = #{receiverId}
            </if>
            <if test="gender != null">
                and love_stick.gender = #{gender}
            </if>
            <if test="age != null">
                and love_stick.age = #{age}
            </if>
            <if test="qq != null">
                and love_stick.qq = #{qq}
            </if>
            ...
        </where>
    </select>
```

:::warning
我们可以看到我们将两个用户的信息进行了区分，并且将接受者的字段前面加上了 r\_前缀，与上面的 resultMap 中的映射相对应。然后在 where 标签中，我们通过 if 标签来动态拼接 SQL 语句，从而实现动态查询。
:::

## 规范化方式

这里我参考了 MyBatis Generate 生成的 Mapper 代码，将两个进行配合使用，就是在 MyBatis generate 生成的代码的基础上，添加上我们自己的连表动态查询，并且这个动态查询的方法借鉴了其实现方式。

我们先来看一看 MyBatis Generate 生成的 Mapper 代码，虽然没有连表查询，但是其动态查询的方式十分值得借鉴：

```xml
    <resultMap id="BaseResultMap" type="com.maoyan.model.Appointment">
        <id column="appoint_id" jdbcType="BIGINT" property="appointId"/>
        <result column="appoint_user_id" jdbcType="BIGINT" property="appointUserId"/>
        <result column="appoint_driver_id" jdbcType="BIGINT" property="appointDriverId"/>
        <result column="appoint_status" jdbcType="BIT" property="appointStatus"/>
        <result column="address" jdbcType="VARCHAR" property="address"/>
        <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
        <result column="receive_time" jdbcType="TIMESTAMP" property="receiveTime"/>
    </resultMap>

    <sql id="Base_Column_List">
        appoint_id,
        appoint_user_id,
        appoint_driver_id,
        appoint_status,
        address,
        create_time,
        receive_time
    </sql>

    <select id="selectByExample" parameterType="com.maoyan.model.AppointmentExample" resultMap="BaseResultMap">
        select
        <if test="distinct">
            distinct
        </if>
        <include refid="Base_Column_List"/>
        from appointment
        <if test="_parameter != null">
            <include refid="Example_Where_Clause"/>
        </if>
        <if test="orderByClause != null">
            order by ${orderByClause}
        </if>
    </select>
```

可以看到其查询方式有三部分组成：

1. resultMap，其定义了查询结果的映射关系，这里我们定义了 Appointment 类，并且将查询结果映射到该类中。
2. sql，其定义了查询的 SQL 语句，这里我们定义了查询的字段，并且将查询结果映射到 Appointment 类中。
3. selectByExample，其定义了查询的方法，并且将查询的参数传递给该方法。

那么同样的，我们可以在此基础上添加上连表的语句，即可实现规范化的连表动态查询，这里我们依照着三个步骤来实现。

首先定义我们自己的 resultMap，需要注意的点跟上面的一样，这里不过多介绍：

```xml
<resultMap id="ComplexResultMap" type="com.maoyan.model.vo.AppointmentVO">
        <result column="appoint_id" property="appointId"/>
        <result column="appoint_user_id" property="appointUserId"/>
        <result column="appoint_driver_id" property="appointDriverId"/>
        <result column="appoint_status" property="appointStatus"/>
        <result column="address" property="address"/>
        <result column="create_time" property="createTime"/>
        <result column="receive_time" property="receiveTime"/>
        <association property="user" javaType="com.maoyan.model.User">
            <result column="user_id" property="userId"/>
            <result column="username" property="username"/>
            <result column="email" property="email"/>
            <result column="status" property="status"/>
            <result column="avatar" property="avatar"/>
            <result column="identification_card" property="identificationCard"/>
            <result column="phone" property="phone"/>
            <result column="driver_license_font" property="driverLicenseFont"/>
            <result column="driver_license_back" property="driverLicenseBack"/>
        </association>
        <association property="driver" javaType="com.maoyan.model.User">
            <result column="d_user_id" property="userId"/>
            <result column="d_username" property="username"/>
            <result column="d_email" property="email"/>
            <result column="d_background" property="background"/>
            <result column="d_status" property="status"/>
            <result column="d_avatar" property="avatar"/>
            <result column="d_identification_card" property="identificationCard"/>
            <result column="d_phone" property="phone"/>
            <result column="d_driver_license_font" property="driverLicenseFont"/>
            <result column="d_driver_license_back" property="driverLicenseBack"/>
        </association>
    </resultMap>
```

然后定义我们的 SQL 查询语句：

```xml
<sql id="Comprehensive_Column_List">
        appoint_id,
        appoint_user_id,
        appoint_driver_id,
        appoint_status,
        address,
        create_time,
        receive_time,
        student.user_id,
        student.username,
        student.email,
        student.background,
        student.status,
        student.avatar,
        student.identification_card,
        student.phone,
        student.driver_license_font,
        student.driver_license_back,
        driver.user_id as d_user_id,
        driver.username as d_username,
        driver.email as d_email,
        driver.background as d_background,
        driver.status as d_status,
        driver.avatar as d_avatar,
        driver.identification_card as d_identification_card,
        driver.phone as d_phone,
        driver.driver_license_font as d_driver_license_font,
        driver.driver_license_back as d_driver_license_back
    </sql>
```

最后实现我们的动态查询：

```xml
<select id="selectComplexByExample" parameterType="com.maoyan.model.AppointmentExample" resultMap="ComplexResultMap">
        select
        <if test="distinct">
            distinct
        </if>
        <include refid="Comprehensive_Column_List"/>
        from appointment
                 left join user as student on appointment.appoint_user_id = student.user_id
                 left join user as driver on appointment.appoint_driver_id = driver.user_id
        <if test="_parameter != null">
            <include refid="Example_Where_Clause"/>
        </if>
        <if test="orderByClause != null">
            order by ${orderByClause}
        </if>
    </select>
```

## 总结

1. 在 MyBatis 中，查询可以分为三个部分，resultMap，sql 以及查询语句。
2. resultMap中的association标签可以实现关联查询。并且要放到最后。
3. 在association的标签中，建议带上对应前缀与sql语句中的as相对应。