// import
import LogoImg from '../../assets/images/logo.svg';
import Image from "next/image";
import Link from 'next/link'

import styles from "./style.module.scss";
import { SignInButton } from "../SignInButton";
import { ActiveLink } from '../ActiveLink';

export function Header() {


  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={LogoImg} alt="Logo IgNews" />

        <nav>
          <ActiveLink activeClassName={styles.active} href="/" >
            <a>
            Home
            </a>
          </ActiveLink>
          
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
