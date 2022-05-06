for file in ./client/src/**/**/**/**/**.jsx
do
  mv "$file" "${file%.jsx}.tsx"
done