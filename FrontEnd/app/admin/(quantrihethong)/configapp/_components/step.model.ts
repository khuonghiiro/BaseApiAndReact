import exp from "constants";

export enum EStepEvent
{
    //NAVIGATION
    //[Description("New tab")]
    NewTab = 1,
    //[Description("Activate tab")]
    ActivateTab=2,
    //[Description("Open url")]
    OpenUrl=3,
    //[Description("Close tab")]
    CloseTab=4,
    //[Description("Go back")]
    GoBack=5,
    //[Description("Reload page")]
    ReloadPage=6,
    //MOUSE
    //[Description("Click")]
    Click=7,
    //[Description("Press & Hold")]
    PressAndHold=8,
    //[Description("Mouse movement")]
    MouseMovement=9,
    //[Description("Scroll")]
    Scroll=10,
    //KEYBOARD
    //[Description("Press key")]
    PressKey=11,
    //[Description("Type text")]
    TypeText=12,
    //DATA
    //[Description("Element exists")]
    ElementExists=13,
    //[Description("Get URL")]
    GetURL=14,
    //[Description("Get text")]
    GetText=15,
    //[Description("Get value")]
    GetValue=16,
    //[Description("Get attribute")]
    GetAttribute=17,
    //[Description("Select dropdown")]
    SelectDropdown=18,
    //[Description("Random")]
    Random=19,
    //[Description("File upload")]
    FileUpload=20,
    //[Description("HTTP")]
    HTTP=21,
    //[Description("Read file / variable")]
    ReadFile=22,
    //[Description("Write file")]
    WriteFile=23,
    //[Description("Set variable")]
    SetVariable=24,
    //[Description("Cookies")]
    Cookies=25,
    //[Description("Save assets")]
    SaveAssets=26,
    //[Description("Spreadsheet")]
    Spreadsheet=27,
    //[Description("Insert data")]
    InsertData=28,
    //[Description("Open AI")]
    OpenAI=29,
    //[Description("Case Path")]
    CasePath=30,
    //[Description("RegExp")]
    RegExp=31,
    //[Description("IMAP (Read mail)")]
    IMAP=32,
    //OTHER
    //[Description("Update tag")]
    UpdateTag=33,
    //[Description("Image search")]
    ImageSearch=34,
    //[Description("Screenshot")]
    Screenshot=35,
    //[Description("Clipboard")]
    Clipboard=36,
    //[Description("Switch Frame")]
    SwitchFrame=37,
    //[Description("Switch Page")]
    SwitchPage=38,
    //[Description("Switch Extension popup")]
    SwitchExtensionPopup=39,
    //[Description("Switch Extension popup V2")]
    SwitchExtensionPopupV2=40,
    //[Description("Trigger Extension")]
    TriggerExtension=41,
    //[Description("Dialog/Alert")]
    DialogAlert=42,
    //[Description("Sleep")]
    Sleep=43,
    //[Description("If")]
    If=44,
    //[Description("Eval")]
    Eval=45,
    //[Description("Javascript")]
    Javascript=46,
    //[Description("Loop")]
    Loop=47,
    //[Description("LoopV2 (Beta)")]
    LoopV2=48,
    //[Description("Break (Beta)")]
    Break=49,
    //[Description("Emulate")]
    Emulate=50,
    //[Description("Comment")]
    Comment=51,
    //[Description("Stop")]
    Stop=52,
}


//Wait for navigation
export enum EStepWaitForNavigation
{
    //[Description("Load")]
    Load = 1,
    //[Description("DOMcontentloaded")]
    Dom = 2,
    //[Description("Networkidle0")]
    Networkidle0 = 3,
    //[Description("Networkidle2")]
    Networkidle2 = 4,
}
//Button click
export enum EStepButton
{
    //[Description("Left")]
    Left = 1,
    //[Description("Right")]
    Right = 2,
    //[Description("Center")]
    Center = 3,
}
//Select by
export enum EStepSelectBy
{
    //[Description("Selector")]
    Selector = 1,
    //[Description("Coordinates")]
    Coordinates = 2,
}

//Select by
export enum EStepSelectorType
{
    //[Description("Xpath")]
    Xpath = 1,
    //[Description("CSS")]
    CSS = 2,
    //[Description("Text")]
    Text = 3,
}
//Direction
export enum EStepDirection
{
    //[Description("Down")]
    Down = 1,
    //[Description("Up")]
    Up = 2,
}
//Type random
export enum EStepTypeRandom
{
    //[Description("Email")]
    Email = 1,
    //[Description("Password")]
    Password = 2,
    //[Description("FullName")]
    FullName = 3,
    //[Description("First Name")]
    FirstName = 4,
    //[Description("Last Name")]
    LastName = 5,
    //[Description("Product")]
    Product = 6,
    //[Description("Number")]
    Number = 7,
}

//File type
export enum EStepFileType
{
    //[Description("File")]
    File = 1,
    //[Description("Url (image)")]
    Url = 2,
    //[Description("Base64 (image)")]
    Base64 = 3,
}
//Method
export enum EStepMethod
{
    //[Description("GET")]
    GET = 1,
    //[Description("POST")]
    POST = 2,
    //[Description("PUT")]
    PUT = 3,
}
//ResponseType
export enum EStepResponseType
{
    //[Description("JSON")]
    JSON = 1,
    //[Description("RAW")]
    RAW = 2,
}

//Input Type
export enum EStepInputType
{
    //[Description("File")]
    File = 1,
    //[Description("Variable")]
    Variable = 2,
}

//Input Type
export enum EStepMode
{
    //[Description("Line by line")]
    Line = 1,
    //[Description("Line by line with delimiter")]
    LineDelimiter = 2,
}
//Content Type
export enum EStepContentType
{
    //[Description("JSON")]
    JSON = 1,
    //[Description("Text")]
    Text = 2,
    //[Description("Form URLEndcoded")]
    FormUrlEndcoded = 3,
    //[Description("Form Data")]
    FormData = 4,
}

//Select type
export enum EStepSelectorTypeWriteFile
{
    //[Description("TXT")]
    TXT = 1,
    //[Description("CSV")]
    CSV = 2,
    //[Description("JSON")]
    JSON = 3,
}

//Select Write mode
export enum EStepSelectWriteMode
{
    //[Description("Overwrite")]
    Overwrite = 1,
    //[Description("Append")]
    Append = 2,
}
//Append mode
export enum EStepAppendMode
{
    //[Description("New line")]
    NewLine = 1,
    //[Description("Same line")]
    SameLine = 2,
}

//Operator
export enum EStepOperatorVariable
{
    //[Description("=")]
    Bang = 1,
    //[Description("+")]
    Cong = 2,
    //[Description("-")]
    Tru = 3,
    //[Description("*")]
    Nhan = 4,
    //[Description("/")]
    Chia = 5,
    //[Description("Concatenate")]
    Concatenate = 6,
}

//LoopType
export enum EStepLoopType
{
    //[Description("For")]
    For = 1,
    //[Description("While")]
    While = 2,
}
//OperatorLoop
export enum EStepOperator
{
    //[Description("<")]
    Le = 1,
    //[Description(">")]
    Ge = 2,
    //[Description("=")]
    Eq = 3,
    //[Description("!=")]
    Other = 4,
    //[Description("<=")]
    Leq = 5,
    //[Description(">=")]
    Geq = 6,
}

//Action excel
export enum EStepActionExcel
{
    //[Description("Read")]
    Read = 1,
    //[Description("Write")]
    Write = 2,
    //[Description("Clear")]
    Clear = 3,
        
}
//Storage excel
export enum EStepStorageExcel
{
    //[Description("Variables")]
    Variable = 1,
    //[Description("Loop data")]
    Loop = 2,
}
export enum EStepTarget
{
    //[Description("Array")]
    Array = 1,
    //[Description("JSON")]
    JSON = 2,

}
