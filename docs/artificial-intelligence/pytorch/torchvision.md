# Torchvision中的数据集使用
官方网站：[pytorch.org/vision/stabl...](https://pytorch.org/vision/stable/index.html)

Dataset数据集：[pytorch.org/vision/stabl...](https://pytorch.org/vision/stable/datasets.html)

# Torchvision的介绍

Torchvision是PyTorch生态系统中的一个软件包，它提供了一系列用于计算机视觉任务的工具和数据集。它是PyTorch官方提供的扩展包，旨在简化**计算机视觉任务**的开发过程。
Torchvision提供了以下的主要功能：

1. 数据集和数据加载器：Torchvision包含了许多常用的计算机视觉数据集，如MNIST、CIFAR10、COCO等。它还提供了用于加载和预处理这些数据集的数据加载器，方便数据的批量处理和训练集测试集划分。
2. 图像变换和预处理：Torchvision提供了一系列图像变换和预处理操作，可以在数据加载过程中对图像进行实时变换，如随机裁剪、缩放、翻转、归一化等。
3. 模型和预训练模型：Torchvision包含了一些经典的计算机视觉模型，如AlexNet、VGG、ResNet等，你可以直接使用这些模型进行训练或进行迁移学习。此外，Torchvision还提供了一些预训练的模型权重，可以方便地加载这些模型并在新任务上进行微调。
4. 图像工具：Torchvision提供了一些用于图像处理和可视化的实用工具，如图像保存、绘制边界框、图像的均值和标准差计算等。

# 数据集的使用

例如使用CIFAR10数据集，基本的参数如下

```python
import torchvision
train_set = torchvision.datasets.CIFAR10(root="./dataset",train=True,download=True)
test_set = torchvision.datasets.CIFAR10(root="./dataset",train=False,download=True)
```

* root：储存数据集的文件夹
* train：是否用这个数据集来训练
* download：如果没有这个数据集，是否自动下载

将数据都转换为Tensor数据类型。

```python
import torchvision

# 声明一个转换器
dataset_transforms = torchvision.transforms.Compose([
    torchvision.transforms.ToTensor()
])
# 应用转换器
train_set = torchvision.datasets.CIFAR10(root="./dataset", train=True, transform=dataset_transforms, download=True)
test_set = torchvision.datasets.CIFAR10(root="./dataset", train=False, transform=dataset_transforms, download=True)

print(train_set[0][0])
```

* 第三个参数为转换器，将数据转换。
TensorBoard

```python
import torchvision
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter('logs')
# 声明一个转换器
dataset_transforms = torchvision.transforms.Compose([
    torchvision.transforms.ToTensor()
])
# 应用转换器
train_set = torchvision.datasets.CIFAR10(root="./dataset", train=True, transform=dataset_transforms, download=True)
test_set = torchvision.datasets.CIFAR10(root="./dataset", train=False, transform=dataset_transforms, download=True)

print(train_set[0][0])
# 使用TensorBoard显示
writer.add_image("CIFAR10", train_set[0][0], 1, dataformats='CHW')
writer.close()
```