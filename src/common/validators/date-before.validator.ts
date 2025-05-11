import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBeforeOrEqualTo(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsBeforeOrEqualTo',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedPropertyName],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropName];

          if (!value || !relatedValue) return true;

          const thisDate = new Date(value);
          const otherDate = new Date(relatedValue);

          return thisDate <= otherDate;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropName] = args.constraints;
          return `${args.property} must not be later than ${relatedPropName}`;
        },
      },
    });
  };
}
