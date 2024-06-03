# 加载数据
# Dataset

当我们得到一个数据集时，Dataset类可以帮我们提取我们需要的数据，我们用子类继承Dataset类，我们先给每个数据一个编号（idx），在后面的神经网络中，初始化Dataset子类实例后，就可以通过这个编号去实例对象中读取相应的数据，会自动调用__getitem__方法，同时子类对象也会获取相应真实的Label（人为去复写即可）

**导入Dataset类**

```python
from torch.utils.data import Dataset
```

该类是一个抽象类，所有的数据集想要在数据与标签之间建立映射，都需要继承这个类，所有的子类都需要重写__getitem__方法，该方法根据索引值获取每一个数据并且获取其对应的Label，子类也可以重写__len__方法，返回数据集的size大小

**创建自己的Dataset类，并重写init和gititem方法**

```python
class GetData(Dataset):
    def __init__(self):
        pass

    def __getitem__(self, index):  # 默认是item，但常改为idx，是index的缩写
        pass
```

重写__inti__方法

```python
class GetData(Dataset):
    def __init__(self, root_dir, label_dir):
        self.root_dir = root_dir
        self.label_dir = label_dir
        self.path = os.path.join(self.root_dir, self.label_dir)
        self.img_path_list = os.listdir(self.path)
```

重写__getitem__方法

```python
    def __getitem__(self, index):
        img_name = self.img_path[index]
        img_item_path = os.path.join(self.root_dir,self.label_dir, img_name)
        img = Image.open(img_item_path)
        label = self.label_dir
        return img, label
```

这里没有label文件夹，所以先使用图片文件夹的名称代替。

可以再重写一个__len__方法来判断数据集的大小

```python
    def __len__(self):
        return len(self.img_path)
```

显示其中的文件

```python
root_dir = "./datas/train/train"
ants_label_dir = "ants"
bees_label_dir = "bees"
ants_dataset = MyData(root_dir, ants_label_dir)
bees_dataset = MyData(root_dir, bees_label_dir)
train_dataset = ants_dataset + bees_dataset
img, label = train_dataset[124]
print(label)
img.show()
print(len(train_dataset))
```

当然，Pytorch中也为我们提供了许多的经典的数据集，我们也可以直接下载使用。详见-->🍴[Torchvision中的数据集使用](./torchvision)