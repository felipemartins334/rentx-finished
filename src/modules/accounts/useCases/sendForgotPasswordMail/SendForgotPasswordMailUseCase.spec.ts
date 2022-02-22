import { DayJsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "../../../../shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokenRepositoryInMemory } from "../../repositories/in-memory/UsersTokenRepositoryInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokenRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let mailProvider: MailProviderInMemory;

describe("SendForgotPasswordMailUseCase", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokenRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("Should be able to send a email for a user to reset his password", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "3512329605",
      email: "tokvuzer@vadinvo.gn",
      name: "Allie Jenkins",
      password: "test",
    });
    await sendForgotPasswordMailUseCase.execute("tokvuzer@vadinvo.gn");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should not be able to send a email for an inexistent user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");
    await expect(
      sendForgotPasswordMailUseCase.execute("cucok@soson.au")
    ).rejects.toEqual(new AppError('User does not exist'));

    expect(sendMail).not.toBeCalled();
  });

  it("Should be able to create a new token to reset password", async () => {
    const generatedToken = jest.spyOn(usersTokensRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      driver_license: "3512329605",
      email: "tokvuzer@vadinvo.gn",
      name: "Allie Jenkins",
      password: "test",
    });
    await sendForgotPasswordMailUseCase.execute("tokvuzer@vadinvo.gn");

    expect(generatedToken).toHaveBeenCalled();
  });
});