# Pytorch的安装
## 安装CUDA Tookit
选择CUDA的版本：[安装Pytorch如何选择CUDA的版本，看这一篇就够了](https://zhuanlan.zhihu.com/p/396344997)

[CUDA Toolkit 12.1 Update 1 Downloads | NVIDIA Developer](https://developer.nvidia.com/cuda-downloads?target_os=Windows&target_arch=x86_64&target_version=11&target_type=exe_local)

各个版本的CUDA：[CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive)

## 查看CUDA安装的版本
```bash
nvidia-smi  #右上角显示CUDA版本(驱动API) 直接用这个版本就行
nvcc -V # 这个才是准确的CUDA版本
```

验证Cuda是否安装成功

```bash
nvcc --version
```

## 安装Pytorch
Pytorch官网：[PyTorch](https://pytorch.org/)

PyTorch安装方法：[Start Locally | PyTorch --- 从本地开始 |火炬](https://pytorch.org/get-started/locally/)

### 检查是否安装成功
执行下列代码

```python
import torch
x = torch.rand(2,3)
print(x)
```