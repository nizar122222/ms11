import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCart = async (req: any, res: Response): Promise<void> => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
                sizes: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true } },
                  sizes: true,
                },
              },
            },
          },
        },
      });
    }

    const total = cart.items.reduce((sum, item) => {
      const price =
        item.product.isOnSale && item.product.salePrice
          ? item.product.salePrice
          : item.product.price;
      return sum + (price + (item.customizationPrice || 0)) * item.quantity;
    }, 0);

    res.json({ cart, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const addToCart = async (req: any, res: Response): Promise<void> => {
  try {
    const { productId, size, quantity = 1, customName, customNumber, customizationPrice = 0 } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { sizes: true },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const sizeInfo = product.sizes.find(
      (s) => s.size === size && s.isActive
    );
    if (!sizeInfo || sizeInfo.stock < quantity) {
      res.status(400).json({ error: "Insufficient stock for selected size" });
      return;
    }

    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId_size: { cartId: cart.id, productId, size } },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > sizeInfo.stock) {
        res.status(400).json({ error: "Insufficient stock" });
        return;
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty, customName: customName || null, customNumber: customNumber || null, customizationPrice: customizationPrice || 0 },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, size, quantity, customName: customName || null, customNumber: customNumber || null, customizationPrice: customizationPrice || 0 },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
                sizes: true,
              },
            },
          },
        },
      },
    });

    const total = updatedCart!.items.reduce((sum, item) => {
      const price =
        item.product.isOnSale && item.product.salePrice
          ? item.product.salePrice
          : item.product.price;
      return sum + (price + (item.customizationPrice || 0)) * item.quantity;
    }, 0);

    res.json({ cart: updatedCart, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const updateCartItem = async (req: any, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: { include: { sizes: true } } },
    });

    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const sizeInfo = item.product.sizes.find(
        (s) => s.size === item.size
      );
      if (sizeInfo && sizeInfo.stock < quantity) {
        res.status(400).json({ error: "Insufficient stock" });
        return;
      }
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
                sizes: true,
              },
            },
          },
        },
      },
    });

    const total = updatedCart!.items.reduce((sum, item) => {
      const price =
        item.product.isOnSale && item.product.salePrice
          ? item.product.salePrice
          : item.product.price;
      return sum + (price + (item.customizationPrice || 0)) * item.quantity;
    }, 0);

    res.json({ cart: updatedCart, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

export const removeFromCart = async (req: any, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
                sizes: true,
              },
            },
          },
        },
      },
    });

    const total = updatedCart!.items.reduce((sum, item) => {
      const price =
        item.product.isOnSale && item.product.salePrice
          ? item.product.salePrice
          : item.product.price;
      return sum + (price + (item.customizationPrice || 0)) * item.quantity;
    }, 0);

    res.json({ cart: updatedCart, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

export const clearCart = async (req: any, res: Response): Promise<void> => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
