import { useMemo } from 'react';

interface propsInterface {
  name: string;
  size?: string;
  color?: string;
  profix?: string;
  className?: string;
}

export default function SvgIcon(props: propsInterface) {
  const size = props.size ?? '36px';
  const color = props.color ?? '';
  const profix = props.profix ?? 'icon';
  const className = props.className ?? '';

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
    >
      <use xlinkHref={iconName} />
    </svg>
  );
}
