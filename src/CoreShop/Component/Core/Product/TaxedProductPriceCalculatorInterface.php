<?php
/**
 * CoreShop.
 *
 * This source file is subject to the GNU General Public License version 3 (GPLv3)
 * For the full copyright and license information, please view the LICENSE.md and gpl-3.0.txt
 * files that are distributed with this source code.
 *
 * @copyright  Copyright (c) CoreShop GmbH (https://www.coreshop.org)
 * @license    https://www.coreshop.org/license     GNU General Public License version 3 (GPLv3)
 */

declare(strict_types=1);

namespace CoreShop\Component\Core\Product;

use CoreShop\Component\Order\Model\PurchasableInterface;

interface TaxedProductPriceCalculatorInterface
{
    public function getPrice(PurchasableInterface $product, array $context, bool $withTax = true): int;

    public function getDiscountPrice(PurchasableInterface $product, array $context, bool $withTax = true): int;

    public function getDiscount(PurchasableInterface $product, array $context, bool $withTax = true): int;

    public function getRetailPrice(PurchasableInterface $product, array $context, bool $withTax = true): int;
}
