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

namespace CoreShop\Bundle\PayumBundle\Storage;

use CoreShop\Component\Payment\Model\PaymentInterface;
use Doctrine\DBAL\LockMode;
use Doctrine\ORM\EntityManager;
use Payum\Core\Bridge\Doctrine\Storage\DoctrineStorage;

class LockingStorage extends DoctrineStorage
{
    protected function doFind($id)
    {
        $objectManager = $this->objectManager;
        /** @psalm-var class-string $modelClass */
        $modelClass = $this->modelClass;

        if ($objectManager instanceof EntityManager) {
            if (
                in_array(PaymentInterface::class, class_implements($modelClass), true) &&
                $objectManager->getConnection()->isTransactionActive()
            ) {
                $objectManager->getConnection()->setAutoCommit(false);

                return $objectManager->find($modelClass, $id, LockMode::PESSIMISTIC_WRITE);
            }
        }

        return parent::doFind($id);
    }
}
