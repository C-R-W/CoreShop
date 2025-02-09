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

namespace CoreShop\Bundle\CustomerBundle\Pimcore\Repository;

use CoreShop\Bundle\ResourceBundle\Pimcore\PimcoreRepository;
use CoreShop\Component\Customer\Model\CompanyInterface;
use CoreShop\Component\Customer\Repository\CompanyRepositoryInterface;

class CompanyRepository extends PimcoreRepository implements CompanyRepositoryInterface
{
    public function findCompanyByName(string $name): ?CompanyInterface
    {
        $list = $this->getList();
        $list->setCondition('name = ?', [$name]);
        $objects = $list->load();

        if (count($objects) === 1 && $objects[0] instanceof CompanyInterface) {
            return $objects[0];
        }

        return null;
    }
}
