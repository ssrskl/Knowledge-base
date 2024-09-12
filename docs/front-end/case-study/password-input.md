---
title: 密码输入框
sidebar_position: 3
tags: [案例分析]
---

```tsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordInput() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 6) score++;
    if (pwd.length > 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const getColor = () => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-lime-500";
      case 4:
        return "bg-green-500";
      case 5:
        return "bg-emerald-500";
      default:
        return "bg-gray-200";
    }
  };

  const getLabel = () => {
    switch (strength) {
      case 0:
        return "非常弱";
      case 1:
        return "弱";
      case 2:
        return "一般";
      case 3:
        return "强";
      case 4:
        return "很强";
      case 5:
        return "非常强";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="password">密码</Label>
      <Input
        id="password"
        type="password"
        placeholder="输入密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">
        密码强度: <span className="font-medium">{getLabel()}</span>
      </p>
    </div>
  );
}
```
