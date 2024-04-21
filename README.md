## API raromdb

- E-mail é único e a senha de cadastro deve ter entre 6 e 12 dígitos
- Existem 3 tipos de usuário. comum, crítico e Admin
- Todos os usuários nascem com o tipo "comum", sem permissões especiais
- Um usuário pode ser promovido à crítico ou a admin sem passar por critérios
especiais.
- Na consulta detalhada de filme, todas as reviews já feitas devem ser retornadas,
incluindo os dados do usuário que criou a avaliação.


Sem login: 
- Pode se cadastrar
- Consulta de filmes é aberta - Pode listar todos os filmes cadastrados e buscar por titulo/ ID


Usuario Comum: 
- Login 
- Consultar e alterar suas proprias informações
- Criar review - um por filme
- Alterar review 
- Inativar a sua própria conta


Administrador: 
- Apenas usuários administradores podem cadastrar filmes
- Apenas usuários administradores podem atualizar informações dos filmes
- Apenas usuários administradores podem excluir filmes cadastrados
- Apenas usuários administradores podem listar todos usuários
- Apenas usuários administradores podem buscar usuário pelo ID 
- Apenas usuários administradores podem alterar informações de QUALQUER USUÁRIO
- Apenas usuários administradores podem excluir definitivamente uma conta
- 

