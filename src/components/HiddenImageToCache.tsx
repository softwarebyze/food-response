export default function HiddenImageToCache({
  style,
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  return (
    <img style={{ visibility: 'hidden', height: '1px', ...style }} {...props} />
  )
}
