import { useMemo } from 'react';

interface propsInterface {
  name: string;
  size?: string;
  color?: string;
  profix?: string;
  className?: string;
  onClick?: () => void;
}

export default function SvgIcon(props: propsInterface) {
  const size = props.size ?? '36px';
  const color = props.color ?? '';
  const profix = props.profix ?? 'icon';
  const className = props.className ?? '';
  const onClick = props.onClick ?? null;

  const iconName = useMemo<string>(() => {
    return `#${profix}-${props.name}`;
  }, [profix, props.name]);

  return (
    <svg
      style={{
        height: size,
        width: size,
        fill: 'currentColor' || color,
        position: 'relative',
      }}
      className={className}
      aria-hidden="true"
      onClick={onClick}
    >
      <use xlinkHref={iconName} />
    </svg>
  );
}
