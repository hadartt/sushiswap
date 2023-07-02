import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@sushiswap/currency'

import { Fee } from '../fee'

export const computeStablePoolAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: Fee
}): string => {
  // does safety checks
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const deployData = defaultAbiCoder.encode(['address', 'address', 'uint256'], [token0.address, token1.address, fee])

  const STABLE_POOL_INIT_CODE_HASH = keccak256(
    ['bytes'],
    [
      '0x6101e060405260016006553480156200001757600080fd5b50604080518082018252601581527f537573686920537461626c65204c5020546f6b656e0000000000000000000000602080830191825283518085019094526004845263053534c560e41b9084015281519192916012916200007d9160009190620004f6565b50815162000093906001906020850190620004f6565b5060ff81166080524660a052620000a96200045a565b60c08181525050505050600080336001600160a01b031663d039f6226040518163ffffffff1660e01b8152600401600060405180830381865afa158015620000f5573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526200011f9190810190620005dd565b915091506000806000848060200190518101906200013e9190620006ce565b919450925090506001600160a01b0383166200016d5760405163d92e233d60e01b815260040160405180910390fd5b816001600160a01b0316836001600160a01b03161415620001a15760405163065af08d60e01b815260040160405180910390fd5b612710811115620001c55760405163da7459b760e01b815260040160405180910390fd5b6001600160a01b038084166101608190529083166101805260e0829052612710829003610100526040805163313ce56760e01b8152905163313ce567916004808201926020929091908290030181865afa15801562000228573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200024e919062000716565b6200025b90600a62000857565b6101a08181525050816001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015620002a2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002c8919062000716565b620002d590600a62000857565b6101c08181525050836001600160a01b031663c14ad8026040518163ffffffff1660e01b8152600401602060405180830381865afa1580156200031c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000342919062000868565b600781905550836001600160a01b0316630c0a0cd26040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000387573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003ad919062000882565b600860006101000a8154816001600160a01b0302191690836001600160a01b03160217905550836001600160a01b0316634da318276040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000412573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000438919062000882565b6001600160a01b03908116610120529390931661014052506200098392505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60006040516200048e9190620008df565b6040805191829003822060208301939093528101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b8280546200050490620008a2565b90600052602060002090601f01602090048101928262000528576000855562000573565b82601f106200054357805160ff191683800117855562000573565b8280016001018555821562000573579182015b828111156200057357825182559160200191906001019062000556565b506200058192915062000585565b5090565b5b8082111562000581576000815560010162000586565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114620005c857600080fd5b50565b8051620005d881620005b2565b919050565b60008060408385031215620005f157600080fd5b82516001600160401b03808211156200060957600080fd5b818501915085601f8301126200061e57600080fd5b8151818111156200063357620006336200059c565b604051601f8201601f19908116603f011681019083821181831017156200065e576200065e6200059c565b816040528281526020935088848487010111156200067b57600080fd5b600091505b828210156200069f578482018401518183018501529083019062000680565b82821115620006b15760008484830101525b9550620006c3915050858201620005cb565b925050509250929050565b600080600060608486031215620006e457600080fd5b8351620006f181620005b2565b60208501519093506200070481620005b2565b80925050604084015190509250925092565b6000602082840312156200072957600080fd5b815160ff811681146200073b57600080fd5b9392505050565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115620007995781600019048211156200077d576200077d62000742565b808516156200078b57918102915b93841c93908002906200075d565b509250929050565b600082620007b25750600162000851565b81620007c15750600062000851565b8160018114620007da5760028114620007e55762000805565b600191505062000851565b60ff841115620007f957620007f962000742565b50506001821b62000851565b5060208310610133831016604e8410600b84101617156200082a575081810a62000851565b62000836838362000758565b80600019048211156200084d576200084d62000742565b0290505b92915050565b60006200073b60ff841683620007a1565b6000602082840312156200087b57600080fd5b5051919050565b6000602082840312156200089557600080fd5b81516200073b81620005b2565b600181811c90821680620008b757607f821691505b60208210811415620008d957634e487b7160e01b600052602260045260246000fd5b50919050565b600080835481600182811c915080831680620008fc57607f831692505b60208084108214156200091d57634e487b7160e01b86526022600452602486fd5b818015620009345760018114620009465762000975565b60ff1986168952848901965062000975565b60008a81526020902060005b868110156200096d5781548b82015290850190830162000952565b505084890196505b509498975050505050505050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a0516101c051613e6262000b73600039600081816104fc0152818161288201528181612d2e01528181612df70152612e260152600081816104ad0152818161284701528181612cf301528181612da60152612e770152600081816105b3015281816107e401528181610c7001528181610d5401528181610f8e01528181610fc3015281816111bc0152818161162a015281816116f801528181611a2901528181611a92015281816122e701528181612a840152612c34015260008181610326015281816107bf01528181610c4401528181610ceb01528181610f350152818161104d0152818161114e0152818161159a015281816117b901528181611ac701528181611b640152818161216a015281816129a90152612b5f01526000818161058c0152818161080901528181611f320152611fc70152600081816103fb01528181611529015281816115ee0152818161177d0152818161219e01528181612319015281816125f1015281816126ba01528181612784015281816129dc01528181612ab501528181612b8d0152612c620152600050506000818161042201528181612d6a01528181612f040152612f6f01526000610e6f01526000610e3a015260006103ba0152613e626000f3fe608060405234801561001057600080fd5b506004361061025c5760003560e01c806367e4ac2c11610145578063a8f1f52e116100bd578063cf58879a1161008c578063d505accf11610071578063d505accf146105d5578063dd62ed3e146105e8578063f1c49a391461061357600080fd5b8063cf58879a14610587578063d21220a7146105ae57600080fd5b8063a8f1f52e14610545578063a9059cbb14610558578063af8c09bf1461056b578063c14ad8021461057e57600080fd5b80637bdd6b441161011457806395d89b41116100f957806395d89b41146104ef578063a28af8a4146104f7578063a69840a81461051e57600080fd5b80637bdd6b44146104a85780637ecebe00146104cf57600080fd5b806367e4ac2c1461045757806370a082311461046c5780637464fc3d1461048c5780637ba0e2e71461049557600080fd5b80632a07b6c7116101d8578063499a3c50116101a757806354cf2aeb1161018c57806354cf2aeb1461041d578063627dd56a1461044457806365dfc7671461029c57600080fd5b8063499a3c50146102615780634da31827146103f657600080fd5b80632a07b6c71461036e57806330adf81f1461038e578063313ce567146103b55780633644e515146103ee57600080fd5b80630c0a0cd21161022f57806318160ddd1161021457806318160ddd146103485780631dd19cb41461035157806323b872dd1461035b57600080fd5b80630c0a0cd2146102dc5780630dfe16811461032157600080fd5b8063053da1c81461026157806306fdde03146102875780630902f1ac1461029c578063095ea7b3146102b9575b600080fd5b61027461026f3660046136cf565b61061b565b6040519081526020015b60405180910390f35b61028f610622565b60405161027e919061376d565b6102a46106b0565b6040805192835260208301919091520161027e565b6102cc6102c73660046137e3565b6106c8565b604051901515815260200161027e565b6008546102fc9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161027e565b6102fc7f000000000000000000000000000000000000000000000000000000000000000081565b61027460025481565b610359610742565b005b6102cc61036936600461380f565b610a09565b61038161037c3660046136cf565b610b4f565b60405161027e9190613850565b6102747f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b6103dc7f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff909116815260200161027e565b610274610e36565b6102fc7f000000000000000000000000000000000000000000000000000000000000000081565b6102747f000000000000000000000000000000000000000000000000000000000000000081565b6102746104523660046136cf565b610e91565b61045f61112c565b60405161027e91906138b5565b61027461047a36600461390f565b60036020526000908152604090205481565b61027460095481565b6102746104a33660046136cf565b61122b565b6102747f000000000000000000000000000000000000000000000000000000000000000081565b6102746104dd36600461390f565b60056020526000908152604090205481565b61028f61149f565b6102747f000000000000000000000000000000000000000000000000000000000000000081565b6102747f54726964656e743a537461626c65506f6f6c000000000000000000000000000081565b6102746105533660046136cf565b6114ac565b6102cc6105663660046137e3565b61188b565b6102746105793660046136cf565b611910565b61027460075481565b6102fc7f000000000000000000000000000000000000000000000000000000000000000081565b6102fc7f000000000000000000000000000000000000000000000000000000000000000081565b6103596105e336600461392c565b611c04565b6102746105f63660046139a3565b600460209081526000928352604080842090915290825290205481565b610359611f30565b6000806000fd5b6000805461062f906139dc565b80601f016020809104026020016040519081016040528092919081815260200182805461065b906139dc565b80156106a85780601f1061067d576101008083540402835291602001916106a8565b820191906000526020600020905b81548152906001019060200180831161068b57829003601f168201915b505050505081565b6000806106c0600a54600b549091565b915091509091565b33600081815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906107309086815260200190565b60405180910390a35060015b92915050565b6006546001146107b3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e43590000000000000000000000000000000000000000000060448201526064015b60405180910390fd5b600260068190555060007f0000000000000000000000000000000000000000000000000000000000000000905060007f0000000000000000000000000000000000000000000000000000000000000000905060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b81526004016020604051808303816000875af1158015610874573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108989190613a30565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015290915061094d90829073ffffffffffffffffffffffffffffffffffffffff8616906370a0823190602401602060405180830381865afa15801561090b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061092f9190613a4d565b73ffffffffffffffffffffffffffffffffffffffff8616919061209b565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526109ff90829073ffffffffffffffffffffffffffffffffffffffff8516906370a0823190602401602060405180830381865afa1580156109bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109e19190613a4d565b73ffffffffffffffffffffffffffffffffffffffff8516919061209b565b5050600160065550565b73ffffffffffffffffffffffffffffffffffffffff831660009081526004602090815260408083203384529091528120547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610a9d57610a6b8382613a95565b73ffffffffffffffffffffffffffffffffffffffff861660009081526004602090815260408083203384529091529020555b73ffffffffffffffffffffffffffffffffffffffff851660009081526003602052604081208054859290610ad2908490613a95565b909155505073ffffffffffffffffffffffffffffffffffffffff808516600081815260036020526040908190208054870190555190918716907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610b3a9087815260200190565b60405180910390a360019150505b9392505050565b6060600654600114610bbd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e43590000000000000000000000000000000000000000000060448201526064016107aa565b6002600655600080610bd184860186613aba565b91509150600080610be061212d565b30600090815260036020526040812054929450909250610c00848461242b565b509050600081610c108685613ae8565b610c1a9190613b54565b9050600082610c298686613ae8565b610c339190613b54565b9050610c3f30856124f4565b610c6b7f0000000000000000000000000000000000000000000000000000000000000000838a8a61258a565b610c977f0000000000000000000000000000000000000000000000000000000000000000828a8a61258a565b610c9f6127ea565b6040805160028082526060820190925290816020015b6040805180820190915260008082526020820152815260200190600190039081610cb557905050985060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1681526020018381525089600081518110610d3c57610d3c613b8f565b602002602001018190525060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1681526020018281525089600181518110610da557610da5613b8f565b6020908102919091010152610dcc610dbd8388613a95565b610dc78388613a95565b612842565b600955604080518381526020810183905273ffffffffffffffffffffffffffffffffffffffff8a169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a3505060016006555094979650505050505050565b60007f00000000000000000000000000000000000000000000000000000000000000004614610e6c57610e676128cc565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b6000600654600114610eff576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e43590000000000000000000000000000000000000000000060448201526064016107aa565b600260065560008080610f1485870187613bbe565b925092509250600080600080610f28612966565b93509350935093506000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff161415610fc15750508382037f0000000000000000000000000000000000000000000000000000000000000000610fba8287876001612cee565b995061107c565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff1614611046576040517f2df9739b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50508281037f00000000000000000000000000000000000000000000000000000000000000006110798287876000612cee565b99505b611088818b8a8a61258a565b6110906127ea565b8073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e46062858e60405161110f929190918252602082015260400190565b60405180910390a450506001600655509598975050505050505050565b60408051600280825260608083018452926020830190803683370190505090507f00000000000000000000000000000000000000000000000000000000000000008160008151811061118057611180613b8f565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250507f0000000000000000000000000000000000000000000000000000000000000000816001815181106111ee576111ee613b8f565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505090565b6000600654600114611299576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e43590000000000000000000000000000000000000000000060448201526064016107aa565b600260065560006112ac8385018561390f565b90506000806112be600a54600b549091565b915091506000806112cd61212d565b9150915060006112dd8383612842565b905060006112eb8685613a95565b905060006112f98685613a95565b905060008061130a84848b8b612ea9565b90925090506113296dffffffffffffffffffffffffffff83168a613c09565b98506113456dffffffffffffffffffffffffffff821689613c09565b97506000806113548b8b61242b565b9150915081600014156113c35785158061136c575084155b156113a3576040517fd856fc5a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6113af6103e888613a95565b9c506113be60006103e8612fac565b6113e6565b80826113cf828a613a95565b6113d99190613ae8565b6113e39190613b54565b9c505b8c61141d576040517fd226f9d400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6114278c8e612fac565b61142f6127ea565b6009879055604080518781526020810187905273ffffffffffffffffffffffffffffffffffffffff8e169133917fdbba30eb0402b389513e87f51f4db2db80bed454384ec6925a24097c3548a02a910160405180910390a35050600160065550989b9a5050505050505050505050565b6001805461062f906139dc565b600080806114bc848601866137e3565b915091506000806114d0600a54600b549091565b6040517f5662311800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff878116600483015260248201879052600060448301529294509092507f000000000000000000000000000000000000000000000000000000000000000090911690635662311890606401602060405180830381865afa158015611572573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115969190613a4d565b92507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156116f6577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663da5139ca7f00000000000000000000000000000000000000000000000000000000000000006116568686866001612cee565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815273ffffffffffffffffffffffffffffffffffffffff9092166004830152602482015260006044820152606401602060405180830381865afa1580156116cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116ef9190613a4d565b9450611881565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161461177b576040517f2df9739b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663da5139ca7f00000000000000000000000000000000000000000000000000000000000000006117e58686866000612cee565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815273ffffffffffffffffffffffffffffffffffffffff9092166004830152602482015260006044820152606401602060405180830381865afa15801561185a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061187e9190613a4d565b94505b5050505092915050565b336000908152600360205260408120805483919083906118ac908490613a95565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600081815260036020526040908190208054850190555133907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906107309086815260200190565b600060065460011461197e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e43590000000000000000000000000000000000000000000060448201526064016107aa565b60026006556000808061199385870187613bbe565b9250925092506000806119a9600a54600b549091565b915091506000806119b861212d565b306000908152600360205260408120549294509092506119d8848461242b565b5090506000816119e88685613ae8565b6119f29190613b54565b9050600082611a018686613ae8565b611a0b9190613b54565b9050611a1a610dbd8388613a95565b600955611a2730856124f4565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168b73ffffffffffffffffffffffffffffffffffffffff161415611ac557611a8c82838a03838a036001612cee565b01611ab97f0000000000000000000000000000000000000000000000000000000000000000828c8c61258a565b809b5060009150611b92565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168b73ffffffffffffffffffffffffffffffffffffffff1614611b4a576040517f0620202000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b611b5b81838a03838a036000612cee565b82019150611b8b7f0000000000000000000000000000000000000000000000000000000000000000838c8c61258a565b5099508960005b611b9a6127ea565b604080518381526020810183905273ffffffffffffffffffffffffffffffffffffffff8c169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a35050600160065550979a9950505050505050505050565b42841015611c6e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f5045524d49545f444541444c494e455f4558504952454400000000000000000060448201526064016107aa565b6000611c78610e36565b73ffffffffffffffffffffffffffffffffffffffff89811660008181526005602090815260409182902080546001810190915582517f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98184015280840194909452938c166060840152608083018b905260a083019390935260c08083018a90528151808403909101815260e0830190915280519201919091207f190100000000000000000000000000000000000000000000000000000000000061010083015261010282019290925261012281019190915261014201604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa158015611dd7573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811615801590611e5257508873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b611eb8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f494e56414c49445f5349474e455200000000000000000000000000000000000060448201526064016107aa565b73ffffffffffffffffffffffffffffffffffffffff90811660009081526004602090815260408083208b8516808552908352928190208a905551898152919350918a16917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a350505050505050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663c14ad8026040518163ffffffff1660e01b8152600401602060405180830381865afa158015611f9b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fbf9190613a4d565b6007819055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16630c0a0cd26040518163ffffffff1660e01b8152600401602060405180830381865afa158015612030573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120549190613a30565b600880547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b6040805173ffffffffffffffffffffffffffffffffffffffff8416602482015260448082018490528251808303909101815260649091019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb0000000000000000000000000000000000000000000000000000000017905261212890849061301d565b505050565b6040517ff7888aec00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000818116600484015230602484015260009283927f00000000000000000000000000000000000000000000000000000000000000001691635662311891839063f7888aec90604401602060405180830381865afa1580156121ed573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122119190613a4d565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815273ffffffffffffffffffffffffffffffffffffffff9092166004830152602482015260006044820152606401602060405180830381865afa158015612286573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122aa9190613a4d565b6040517ff7888aec00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000081811660048401523060248401529294507f00000000000000000000000000000000000000000000000000000000000000001691635662311891839063f7888aec90604401602060405180830381865afa158015612368573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061238c9190613a4d565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815273ffffffffffffffffffffffffffffffffffffffff9092166004830152602482015260006044820152606401602060405180830381865afa158015612401573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124259190613a4d565b90509091565b60025460095460009080156124ec576124448585612842565b9150808211156124ec5760075460008161245e8486613a95565b6124689087613ae8565b6124729190613ae8565b905060006124808484613ae8565b8561248d85612710613a95565b6124979190613ae8565b6124a19190613c09565b905060006124af8284613b54565b905080156124e7576008546124da9073ffffffffffffffffffffffffffffffffffffffff1682612fac565b6124e48188613c09565b96505b505050505b509250929050565b73ffffffffffffffffffffffffffffffffffffffff821660009081526003602052604081208054839290612529908490613a95565b909155505060028054829003905560405181815260009073ffffffffffffffffffffffffffffffffffffffff8416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020015b60405180910390a35050565b8015612664576040517f97da6d3000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8581166004830152306024830152838116604483015260648201859052600060848301527f000000000000000000000000000000000000000000000000000000000000000016906397da6d309060a40160408051808303816000875af1158015612639573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061265d9190613c21565b50506127e4565b6040517fda5139ca00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff858116600483015260248201859052600060448301819052917f00000000000000000000000000000000000000000000000000000000000000009091169063da5139ca90606401602060405180830381865afa158015612703573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127279190613a4d565b6040517ff18d03cc00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff87811660048301523060248301528581166044830152606482018390529192507f00000000000000000000000000000000000000000000000000000000000000009091169063f18d03cc90608401600060405180830381600087803b1580156127ca57600080fd5b505af11580156127de573d6000803e3d6000fd5b50505050505b50505050565b6000806127f561212d565b600a829055600b81905560408051838152602081018390529294509092507fcf2aa50876cdfbb541206f89af0ee78d44a2abf8d328e37fa4917f982149848a910160405180910390a15050565b6000807f00000000000000000000000000000000000000000000000000000000000000008464e8d4a51000028161287b5761287b613b25565b04905060007f00000000000000000000000000000000000000000000000000000000000000008464e8d4a5100002816128b6576128b6613b25565b0490506128c38282613129565b95945050505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60006040516128fe9190613c45565b6040805191829003822060208301939093528101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b600a54600b546040517ff7888aec00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116600483015230602483015260009182917f0000000000000000000000000000000000000000000000000000000000000000169063f7888aec90604401602060405180830381865afa158015612a23573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a479190613a4d565b6040517ff7888aec00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811660048301523060248301529193507f00000000000000000000000000000000000000000000000000000000000000009091169063f7888aec90604401602060405180830381865afa158015612afe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b229190613a4d565b6040517f4ffe34db00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811660048301529192506000917f00000000000000000000000000000000000000000000000000000000000000001690634ffe34db906024016040805180830381865afa158015612bd3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bf79190613d38565b6040517f4ffe34db00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811660048301529192506000917f00000000000000000000000000000000000000000000000000000000000000001690634ffe34db906024016040805180830381865afa158015612ca8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ccc9190613d38565b9050612cd88285613140565b9350612ce48184613140565b9250505090919293565b6000807f00000000000000000000000000000000000000000000000000000000000000008564e8d4a510000281612d2757612d27613b25565b04905060007f00000000000000000000000000000000000000000000000000000000000000008564e8d4a510000281612d6257612d62613b25565b0490506127107f000000000000000000000000000000000000000000000000000000000000000088020487036000612d9a8484613199565b90508515612e225760007f00000000000000000000000000000000000000000000000000000000000000008364e8d4a510000281612dda57612dda613b25565b04850190506000612dec828487613214565b64e8d4a510009086037f000000000000000000000000000000000000000000000000000000000000000002049650612e9d915050565b60007f00000000000000000000000000000000000000000000000000000000000000008364e8d4a510000281612e5a57612e5a613b25565b04840190506000612e6c828488613214565b64e8d4a510009087037f00000000000000000000000000000000000000000000000000000000000000000204965050505b50505050949350505050565b600080831580612eb7575082155b15612ec757506000905080612fa3565b600084612ed48589613ae8565b612ede9190613b54565b9050858111612f3957612ef46127106002613ae8565b612efe8288613a95565b612f28907f0000000000000000000000000000000000000000000000000000000000000000613ae8565b612f329190613b54565b9150612fa1565b600084612f468789613ae8565b612f509190613b54565b9050612f5f6127106002613ae8565b612f69828a613a95565b612f93907f0000000000000000000000000000000000000000000000000000000000000000613ae8565b612f9d9190613b54565b9350505b505b94509492505050565b8060026000828254612fbe9190613c09565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000818152600360209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910161257e565b600061307f826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff1661331d9092919063ffffffff16565b805190915015612128578080602001905181019061309d9190613dba565b612128576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f7420737563636565640000000000000000000000000000000000000000000060648201526084016107aa565b6000610b4861313b61313b8585613199565b613334565b600082602001516fffffffffffffffffffffffffffffffff166000141561316857508061073c565b602083015183516fffffffffffffffffffffffffffffffff9182169161318f911684613ae8565b610b489190613b54565b60008064e8d4a510006131ac8486613ae8565b6131b69190613b54565b9050600064e8d4a510006131ca8580613ae8565b6131d49190613b54565b64e8d4a510006131e48780613ae8565b6131ee9190613b54565b6131f89190613c09565b905064e8d4a5100061320a8284613ae8565b6128c39190613b54565b6000805b60ff8110156133145782600061322e87836133ed565b90508581101561327b5760006132448887613484565b61324e8389613a95565b61325d9064e8d4a51000613ae8565b6132679190613b54565b90506132738187613c09565b9550506132ba565b60006132878887613484565b6132918884613a95565b6132a09064e8d4a51000613ae8565b6132aa9190613b54565b90506132b68187613a95565b9550505b818511156132e35760016132ce8387613a95565b116132de57849350505050610b48565b6132ff565b60016132ef8684613a95565b116132ff57849350505050610b48565b5050808061330c90613dd7565b915050613218565b50909392505050565b606061332c84846000856134e6565b949350505050565b60b58171010000000000000000000000000000000000811061335b5760409190911b9060801c5b690100000000000000000081106133775760209190911b9060401c5b65010000000000811061338f5760109190911b9060201c5b630100000081106133a55760089190911b9060101c5b62010000010260121c80820401600190811c80830401811c80830401811c80830401811c80830401811c80830401811c80830401901c8082048111156133e85781045b919050565b600064e8d4a51000828185816134038280613ae8565b61340d9190613b54565b6134179190613ae8565b6134219190613b54565b61342b9190613ae8565b6134359190613b54565b64e8d4a510008084816134488280613ae8565b6134529190613b54565b61345c9190613ae8565b6134669190613b54565b6134709086613ae8565b61347a9190613b54565b610b489190613c09565b600064e8d4a5100083816134988280613ae8565b6134a29190613b54565b6134ac9190613ae8565b6134b69190613b54565b64e8d4a51000806134c78580613ae8565b6134d19190613b54565b6134dc866003613ae8565b6134709190613ae8565b606082471015613578576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c000000000000000000000000000000000000000000000000000060648201526084016107aa565b73ffffffffffffffffffffffffffffffffffffffff85163b6135f6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016107aa565b6000808673ffffffffffffffffffffffffffffffffffffffff16858760405161361f9190613e10565b60006040518083038185875af1925050503d806000811461365c576040519150601f19603f3d011682016040523d82523d6000602084013e613661565b606091505b509150915061367182828661367c565b979650505050505050565b6060831561368b575081610b48565b82511561369b5782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107aa919061376d565b600080602083850312156136e257600080fd5b823567ffffffffffffffff808211156136fa57600080fd5b818501915085601f83011261370e57600080fd5b81358181111561371d57600080fd5b86602082850101111561372f57600080fd5b60209290920196919550909350505050565b60005b8381101561375c578181015183820152602001613744565b838111156127e45750506000910152565b602081526000825180602084015261378c816040850160208701613741565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b73ffffffffffffffffffffffffffffffffffffffff811681146137e057600080fd5b50565b600080604083850312156137f657600080fd5b8235613801816137be565b946020939093013593505050565b60008060006060848603121561382457600080fd5b833561382f816137be565b9250602084013561383f816137be565b929592945050506040919091013590565b602080825282518282018190526000919060409081850190868401855b828110156138a8578151805173ffffffffffffffffffffffffffffffffffffffff16855286015186850152928401929085019060010161386d565b5091979650505050505050565b6020808252825182820181905260009190848201906040850190845b8181101561390357835173ffffffffffffffffffffffffffffffffffffffff16835292840192918401916001016138d1565b50909695505050505050565b60006020828403121561392157600080fd5b8135610b48816137be565b600080600080600080600060e0888a03121561394757600080fd5b8735613952816137be565b96506020880135613962816137be565b95506040880135945060608801359350608088013560ff8116811461398657600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156139b657600080fd5b82356139c1816137be565b915060208301356139d1816137be565b809150509250929050565b600181811c908216806139f057607f821691505b60208210811415613a2a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b600060208284031215613a4257600080fd5b8151610b48816137be565b600060208284031215613a5f57600080fd5b5051919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600082821015613aa757613aa7613a66565b500390565b80151581146137e057600080fd5b60008060408385031215613acd57600080fd5b8235613ad8816137be565b915060208301356139d181613aac565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615613b2057613b20613a66565b500290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600082613b8a577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080600060608486031215613bd357600080fd5b8335613bde816137be565b92506020840135613bee816137be565b91506040840135613bfe81613aac565b809150509250925092565b60008219821115613c1c57613c1c613a66565b500190565b60008060408385031215613c3457600080fd5b505080516020909101519092909150565b600080835481600182811c915080831680613c6157607f831692505b6020808410821415613c9a577f4e487b710000000000000000000000000000000000000000000000000000000086526022600452602486fd5b818015613cae5760018114613cdd57613d0a565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00861689528489019650613d0a565b60008a81526020902060005b86811015613d025781548b820152908501908301613ce9565b505084890196505b509498975050505050505050565b80516fffffffffffffffffffffffffffffffff811681146133e857600080fd5b600060408284031215613d4a57600080fd5b6040516040810181811067ffffffffffffffff82111715613d94577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604052613da083613d18565b8152613dae60208401613d18565b60208201529392505050565b600060208284031215613dcc57600080fd5b8151610b4881613aac565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415613e0957613e09613a66565b5060010190565b60008251613e22818460208701613741565b919091019291505056fea26469706673582212205896af001c312e838d0681c524a1611a530550596c1663962913eec2cd7f22e664736f6c634300080a0033',
    ]
  )

  // Compute pool address
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [deployData]), STABLE_POOL_INIT_CODE_HASH)
}
