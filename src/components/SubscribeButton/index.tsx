import styles from "./style.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe Now
    </button>
  );
}
