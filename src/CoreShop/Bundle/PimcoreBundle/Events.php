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

namespace CoreShop\Bundle\PimcoreBundle;

final class Events
{
    /**
     * Fired before a order mail will be sent.
     */
    public const PRE_MAIL_SEND = 'coreshop.mail.pre_send';

    /**
     * Fired after a order mail has been sent.
     */
    public const POST_MAIL_SEND = 'coreshop.mail.post_send';
}
