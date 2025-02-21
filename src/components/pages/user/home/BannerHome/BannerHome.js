import LayoutUser from '@/components/layouts/LayoutUser/LayoutUser'
import React from 'react'
import styles from './BannerHome.module.scss'

function BannerHome() {
  return (
    <LayoutUser>
        <div className={styles.container}>BannerHome</div>
    </LayoutUser>
  )
}

export default BannerHome